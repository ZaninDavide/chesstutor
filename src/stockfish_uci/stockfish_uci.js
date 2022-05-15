import Chess from "../chessjs-chesstutor/chess.js"
import { move_to_fromto } from "../utilities/san_parsing.js";

function does_support_stockfish() {
    return !!(typeof (Worker))
}

function get_new_stockfish_enitity() {
    if (!does_support_stockfish()) {
        console.log("Workers needs to be supported in order to use Stockfish.")
        return null;
    } 


    let wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

    let stockfish_worker = new Worker(wasmSupported ? '/stockfish/stockfish.wasm.js' : '/stockfish/stockfish.js');

    return stockfish_worker
}

/* ---------------------------- CLOUD EVALUATION ---------------------------- */

async function get_lichess_cloud_evaluation(fromtos){
    let eval_game = new Chess();
    fromtos.forEach(m => {
        const move = {
            from: m[0] + m[1],
            to: m[2] + m[3],
            promotion: m[4] || undefined
        }
        eval_game.move(move, {from: move.from, to: move.to, promotion: move.promotion, legal: false})
    })
    const possible_moves = eval_game.moves()
    let fen = eval_game.fen()


    const en_passant = fen.split(/ /g, )[3]
    if(en_passant !== "-"){
        if(possible_moves.filter(m => m.piece === "p" && m.flag === "e").length === 0){
        fen = fen.replace(" " + en_passant + " ", " - ")
        }
    }

    let url = "https://lichess.org/api/cloud-eval?fen=" + fen.replace(/ /g, "%20")
    let eval_data = await (fetch(url).then(data => data.json()).then(res => res))


    return eval_data.error ? 
        { depth: -1 }
    :
        {
            depth: eval_data.depth,
            best: eval_data.pvs[0].moves.split(/\s/)[0],
            eval: eval_data.pvs[0].cp / 100,
        }
}

/* ---------------------------- DEBOUNCER ---------------------------- */
let debounceTimer
function debounce(func, delay) {
    return function() {
        const context = this
        const args = arguments
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
} 

// Stockfish and cloud-evaluation cache
let engine_cache = {} // {"fromtos": {depth: _, eval: _, best: _}} // fromtos = "a1|h1|a2|h2"

class Stockfish {
    state = "off";
    worker = null;
    played_fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" // "unknown" means it has to be calculated
    played_moves = []; // ["fromto", "fromto", ...]
    moves_queue = []; // ["fromto", "fromto", ...]
    finishing_calculations = 0;
    depth = 8;
    calculated_depth = 0;
    calculated_eval = 0;
    calculated_best = "";
    set_eval = () => {};
    set_best = () => {};
    set_calculated_depth = () => {};
    set_arrows = () => {};
    get_use_lichess_cloud = () => {};

    constructor(set_eval_callback, set_best_callback, set_calculated_depth, set_arrows, get_use_lichess_cloud) {
        this.set_eval = set_eval_callback
        this.set_best = set_best_callback
        this.set_calculated_depth = set_calculated_depth
        this.set_arrows = set_arrows
        this.get_use_lichess_cloud = get_use_lichess_cloud
    }

    setup() {
        if(!this.worker) {
            if(does_support_stockfish()){
                this.worker = get_new_stockfish_enitity()
                this.worker.addEventListener("message", this.onMessage.bind(this))
                this.send("uci")
                return true;
            }else{
                console.warn("Stockfish cannot be initiated because Workers are not supported.")
                return false;
            }
        }
    }

    set_depth(value) {
        this.depth = value;
    }

    send(message) {
        if(this.worker && message) {
            // console.log("   " + message)
            this.worker.postMessage(message)
        }
    }

    async onMessage(event) {
        const msg = event.data;
        const words = msg.split(/\s/)
        if(words.length > 0){
            const cmd = words[0].trim()
            // const data = msg.slice(cmd.length, msg.length).trim();
            // console.log(cmd, data)

            switch (cmd) {
                case "uciok":
                    if(this.state === "off") {
                        this.state = "waiting"
                        this.send("ucinewgame")
                        this.send("isready")
                    }
                    break;
            
                case "readyok":
                    if(this.state === "waiting"){
                        this.calc()
                    }
                    break;
                case "info":
                    // parse info
                    this.calculated_best = words[words.indexOf("pv") + 1]
                    this.calculated_depth = parseInt(words[words.indexOf("depth") + 1] || this.calculated_depth)
                    this.calculated_eval = parseInt(words[words.indexOf("cp") + 1]) / 100
                    this.set_best(this.calculated_best)
                    this.set_eval(this.calculated_eval)
                    this.set_calculated_depth(this.calculated_depth)

                    // update arrows
                    if(this.moves_queue.length === 0 && this.finishing_calculations >= 1) this.update_arrows(this.calculated_best)

                    // cache result
                    const fromtos = this.played_moves.join("|")
                    this.add_to_cache(fromtos, {
                        eval: this.calculated_eval,
                        depth: this.calculated_depth,
                        best: this.calculated_best
                    })

                    // stop if there's no need to go further
                    if(this.calculated_depth > this.depth) this.send("stop")
                    break;

                case "bestmove":
                    this.finishing_calculations = Math.max(0, this.finishing_calculations - 1)
                    if(this.state === "working" || this.state === "waiting"){
                        this.calculated_eval = 0
                        this.calculated_best = ""
                        this.calculated_depth = 0
                    }

                    if(this.state === "working") this.state = "idle"
                    if(this.state === "waiting") this.send("isready")
                default:
                    break;
            }
        }
    }

    update_arrows(best){
        this.set_arrows([{
            from: best[0] + best[1], 
            to: best[2] + best[3]
        }], true)
    }

    add_to_cache(fromtos, data) {
        if(!engine_cache[fromtos] || engine_cache[fromtos].depth < this.calculated_depth){
            engine_cache[fromtos] = {
                depth: parseInt(data.depth),
                eval: data.eval,
                best: data.best,
            }
        }
    }

    get_played_fen() {
        if(this.played_fen === "unknown") {
            const game = new Chess()
            this.played_moves.forEach(m => {
                const move = {
                    from: m[0] + m[1],
                    to: m[2] + m[3],
                    promotion: m[4] || undefined
                }
                game.move(move, {to: move.to, from: move.from, legal: false})
            });
            this.played_fen = game.fen()
        }
        return this.played_fen
    }

    flush_queue() {
        const game = new Chess()
        const ok = game.load(this.get_played_fen())
        if(ok) {
            this.moves_queue.forEach(m => {
                this.played_moves.push(m)
                const move = {
                    from: m[0] + m[1],
                    to: m[2] + m[3],
                    promotion: m[4] || undefined
                }
                game.move(move, {to: move.to, from: move.from, legal: false})
            });
            
            this.moves_queue = []
            this.played_fen = game.fen()
        }else{
            console.log("Error loading fen position")
        }
    }

    calc() {
        // determine game to process
        // see if the game is cached at depth>this.depth
        // if the game is not cached use stockfish
        this.state = "working"
        this.finishing_calculations += 1
        const moves = this.moves_queue.join(" ")
        if(moves) {
            this.send(`position fen ${this.get_played_fen()} moves ${moves}`)
        }else{
            this.send(`position fen ${this.get_played_fen()}`)
        }
        this.send(`go depth ${this.depth}`)     
        this.flush_queue()
    }

    move(fromto) {
        // add move to queue
        this.moves_queue.push(fromto)
        switch (this.state) {
            case "working":
                this.state = "waiting"
                this.send("stop")
                break;
        
            default:
                break;
        }
    }

    set_moves(json_moves) {
        json_moves.forEach(m => {
            this.move(move_to_fromto(m))
        })
    }

    undo() {
        if(this.moves_queue.length > 0) {
            this.moves_queue.pop()
        }else if(this.played_moves.length > 0){
            this.played_moves.pop()
            this.played_fen = "unknown"
        }
    }

    async go() {
        if(this.moves_queue.length === 0 && this.state === "working") return true;

        let done = false
        const fromtos = this.played_moves.concat(this.moves_queue)
        const cached = engine_cache[fromtos.join("|")] || {depth: -1}

        // check if there's already this calculation in the cache
        if(cached.depth >= this.depth) {
            this.set_best(cached.best)
            this.set_eval(cached.eval)
            this.set_calculated_depth(cached.depth)
            this.update_arrows(cached.best)
            this.flush_queue()
            done = true
        } 
        
        if(!done){
            // wait for delta_t time, if you ask for another "go" than wait again if you don't start
            let debounced_go = debounce(async () => {

                // check if there's already this calculation in the lichess database
                if(!done && this.get_use_lichess_cloud()){
                    // use cloud evaluation when possible
                    const lichess = await get_lichess_cloud_evaluation(fromtos)
                    if(lichess.depth > cached.depth && lichess.depth >= this.depth){
                        // lichess evalutation is usefull
                        this.set_best(lichess.best)
                        this.set_eval(lichess.eval)
                        this.set_calculated_depth(lichess.depth)
                        this.add_to_cache(fromtos.join("|"), lichess)
                        this.update_arrows(lichess.best)
                        this.flush_queue()
                        done = true
                    }
                } 
                
                // otherwise calculate yourself
                if(!done){
                    switch (this.state) {
                        case "off":
                            this.setup()
                            break;
                        case "ready":
                            this.state = "waiting"
                            this.calc()
                            break;
                        case "idle":
                            this.state = "waiting"
                            this.send("isready")
                            break;
                        case "working":
                            // just do nothing it will start calculating when it has finished
                            // it was already told to stop calculating when you moved so don't worry
                            break;
                        default:
                            break;
                    }
                }

            }, 300)
            debounced_go();
        }
    }

    quit() {
      if(this.worker) this.worker.terminate()
    }
}

export default Stockfish