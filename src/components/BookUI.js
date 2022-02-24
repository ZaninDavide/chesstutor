import React, { Component, Suspense } from "react"
import { make_san_nicer_html, move_to_fromto } from "../utilities/san_parsing"
import TogglePanel from "./TogglePanel";
import Translator from "./Translator";
import CheckBox from "./CheckBox";

const WHITE = -100
const BLACK = -200
const ALL = -300

class BookUI extends Component {

    constructor(props) {
        super(props)

        this.state = {
            show_mine: true,
            show_masters: false,
        }

        this.getOptions = this.getOptions.bind(this);
        this.openingOptions = this.openingOptions.bind(this);
        this.groupOptions = this.groupOptions.bind(this);
        this.lineOptions = this.lineOptions.bind(this);
        this.getMastersMoves = this.getMastersMoves.bind(this);
        this.mineBook = this.mineBook.bind(this);
        this.mastersBook = this.mastersBook.bind(this);
        this.filtersSection = this.filtersSection.bind(this);
    }

    componentDidMount() {
        const op_index = this.props.op_index || (this.props.match ? this.props.match.params.op_index : null)
        const vari_name = this.props.match ? this.props.match.params.vari_name : null
        if (op_index !== undefined && op_index !== null) {
            this.props.set_book_query_op_index(parseInt(op_index))
        }
        if (vari_name !== undefined && vari_name !== null) {
            this.props.set_book_query_vari_name(vari_name)
        }
    }

    getOptions() {
        let moves = this.props.get_correct_moves_data_book(this.props.json_moves, this.props.opQuery, this.props.variQuery, this.props.subnameQuery)
        let number = getMoveNumbering(this.props.json_moves.length)

        let compacted_moves = {}

        moves.forEach(m => {
            if(compacted_moves[m.san]){
                if(compacted_moves[m.san][m.op_name]){
                    if(compacted_moves[m.san][m.op_name][m.vari_name]){
                        // same san, same op_name and same vari_name
                        compacted_moves[m.san][m.op_name][m.vari_name].push(m.vari_subname)
                    }else{
                        compacted_moves[m.san][m.op_name][m.vari_name] = []
                        compacted_moves[m.san][m.op_name][m.vari_name].push(m.vari_subname)
                    }
                }else{
                    // the move is the same but it's the first time we find it in this opening
                    compacted_moves[m.san][m.op_name] = {}
                    compacted_moves[m.san][m.op_name][m.vari_name] = []
                    compacted_moves[m.san][m.op_name][m.vari_name].push(m.vari_subname)
                }
            }else{
                // this is the first time we find this move at all
                compacted_moves[m.san] = {}
                compacted_moves[m.san][m.op_name] = {}
                compacted_moves[m.san][m.op_name][m.vari_name] = []
                compacted_moves[m.san][m.op_name][m.vari_name].push(m.vari_subname)
            }
        })

        let html = []

        Object.keys(compacted_moves).forEach(san => {
            let ops = Object.keys(compacted_moves[san])
            ops.sort()

            ops.forEach(op_name => {

                let varis = Object.keys(compacted_moves[san][op_name])
                varis.sort()
                
                varis = varis.map((vari_name, vid) => {
                    // let vari_subnames = compacted_moves[san][op_name][vari_name]
                    // vari_subnames.sort()
                    // let vari_subnames_objects = vari_subnames.map(sub => <span className="impText" key={`vari_${san}_${op_name}_${vari_name}_${sub}`}>{sub + " "}</span>)

                    return <React.Fragment key={`varifrag_${san}_${op_name}_${vari_name}`}>{vid === 0 ? "" : " ⋅ "}{vari_name}</React.Fragment >
                })

                html.push(
                    <tr onClick={() => this.props.book_move(san)} key={`santr_${san}_${op_name}}`}>
                        <td key={`number_${number}_${san}`} className="bookTableNumber">{number}</td>
                        <td key={`san_${number}_${san}`} className="bookTableSan" dangerouslySetInnerHTML={{__html: make_san_nicer_html(san)}}></td>
                        <td key={`op_name_${number}_${san}`}>{op_name}</td>
                        <td key={`varis_${number}_${san}`}>{varis}</td>
                    </tr>
                )
            })
        })


        return html
    }

    openingOptions() {
        let sortable = this.props.ops.map((op, id) => {return {op: op, op_index: id}}) 
        sortable.sort((a, b) => a.op.op_name.localeCompare(b.op.op_name))

        return sortable.map(sop => {
            if(!sop.op.archived){            
                return <option value={sop.op_index} key={"op_"+sop.op_index} className="bookQueryOption" >{sop.op.op_name}</option>
            }else{
                return null
            }
        })
    }

    groupOptions() {
        let op = this.props.opQuery
        if(op === WHITE || op === BLACK || op === null || op === undefined || !this.props.ops[op]) return null;

        let vari_names = [] 

        this.props.ops[op].variations.forEach(vari => {
            if(!vari.archived){
                if(vari_names.indexOf(vari.vari_name) === -1) vari_names.push(vari.vari_name)
            }
        })

        vari_names.sort()

        return vari_names.map(v => <option value={v} key={"vari_"+v} className="bookQueryOption">{v}</option>)
    }

    lineOptions() {
        let op = this.props.opQuery
        if(op === WHITE || op === BLACK || op === null || op === undefined || !this.props.ops[op]) return null;

        let vari_name = this.props.variQuery
        if(vari_name === null || vari_name === undefined) return null;

        let subnames = []
        
        this.props.ops[op].variations.forEach(vari => {
            if(vari.vari_name === vari_name && subnames.indexOf(vari.vari_subname) === -1) subnames.push(vari.vari_subname)
        })

        subnames.sort()

        return subnames.map(s => <option value={s} key={"subname_"+s} className="bookQueryOption">{s}</option>)
    }

    getMastersMoves() {
        let res = get_lichess_master_games(this.props.json_moves.map(move_to_fromto))
        return res;
    }

    mineBook() {
        return <table id="bookTableMine" className="bookTable" key="bookTableMine">
                <tbody>
                    {this.getOptions()}
                    <tr className="titleLineBookUI" key="titleLineBookUIMine">
                        <td>#</td>
                        <td><Translator key="translatorMove" text={"Move"}/></td>
                        <td>
                            <Translator key="translatorOpening" text={"Opening"}/>
                        </td>
                        <td>
                            <Translator key="translatorLine" text={"Line"}/>
                        </td>
                    </tr>
                </tbody>
        </table>
    }

    mastersBook() {
        return <table id="bookTableMasters" className="bookTable" key="bookTableMasters">
            <tbody>
                <ErrorBoundary fallback={<tr><td>Error fetching</td><td></td><td></td><td></td></tr>}>
                    <Suspense fallback={<tr><td></td><td></td><td></td><td></td></tr>}>
                        <MasterGames 
                            getMastersMovesRes={this.getMastersMoves()} 
                            moves_count={this.props.json_moves.length}
                            book_move={this.props.book_move} 
                        />
                    </Suspense>
                </ErrorBoundary>
                <tr className="titleLineBookUI" key="titleLineBookUIMasters">
                    <td>#</td>
                    <td><Translator text={"Move"}/></td>
                    <td><Translator text={"Rating"}/></td>
                    <td><Translator text={"Winrate WDB"}/></td>
                    <td><Translator text={"Games"}/></td>
                </tr>
            </tbody>
        </table>
    }

    filtersSection() {
        const queryToValue = (query) => {
            if(typeof(query) === "number" && isNaN(query)) return ALL.toString()
            switch (query) {
                case true:
                    return WHITE.toString()
                case false:
                    return BLACK.toString()
                case null:
                    return ALL.toString()
                case undefined:
                    return ALL.toString()
                case NaN:
                    return ALL.toString()
                default:
                    return query
            }
        }

        return <TogglePanel title="Filters" panelName="bookFiltersPanel">
            <table id="bookQueryTable" key="bookQueryTable"><tbody>
                <tr key="bookQueryTableTrOpening"><td><Translator key="translatorOpening" text={"Opening"}/>:</td><td>
                    <select className="bookQuerySelector opQuery" key="bookQueryTableOpeningSelector"
                        onChange={e => {
                            if(e.target.value === WHITE.toString()){
                                this.props.set_book_query(true, null, null)
                            }else if(e.target.value === BLACK.toString()){
                                this.props.set_book_query(false, null, null)
                            }else if(e.target.value === ALL.toString()){
                                this.props.set_book_query(null, null, null)
                            }else{
                                this.props.set_book_query(parseInt(e.target.value), null, null)
                            }
                        }} 
                        value={queryToValue(this.props.opQuery)}
                    >
                        <option value={ALL} className="bookQueryOption" key="bookQueryOptionOpAll">{"⋅ All ⋅"}</option>
                        <option value={WHITE} className="bookQueryOption" key="bookQueryOptionOpWhite">{"⋅ White ⋅"}</option>
                        <option value={BLACK} className="bookQueryOption" key="bookQueryOptionOpBlack">{"⋅ Black ⋅"}</option>
                        {this.openingOptions()}
                    </select>    
                </td></tr>
                <tr key="bookQueryTableTrLine"><td><Translator key="translatorLine" text={"Line"}/>:</td><td>
                    <div style={{display: "block"}}>
                        <select className="bookQuerySelector variQuery" key="bookQuerySelectorLine"
                            onChange={e => {
                                if(e.target.value === ALL.toString()){
                                    this.props.set_book_query_vari_name(null)
                                    this.props.set_book_query_vari_subname(null)
                                }else{
                                    this.props.set_book_query_vari_name(e.target.value)
                                    this.props.set_book_query_vari_subname(null)
                                }
                            }} 
                            value={queryToValue(this.props.variQuery)}
                        >
                            <option value={ALL} className="bookQueryOption" key="bookQueryOptionLineAll">{"⋅ All ⋅"}</option>
                            {this.groupOptions()}
                        </select>
                        <select className="bookQuerySelector subnameQuery" key="bookQuerySelectorSubname"
                            onChange={e => {
                                if(e.target.value === ALL.toString()){
                                    this.props.set_book_query_vari_subname(null)
                                }else{
                                    this.props.set_book_query_vari_subname(e.target.value)
                                }
                            }} 
                            value={queryToValue(this.props.subnameQuery)}
                        >
                            <option value={ALL} className="bookQueryOption" key="bookQueryOptionSubnameAll">{"⋅ All ⋅"}</option>
                            {this.lineOptions()}
                        </select>
                    </div>
                </td></tr>
            </tbody></table>
        </TogglePanel>
    }

    render() {
        return <React.Fragment key="bookFragment">
            {this.state.show_mine ? this.mineBook() : null}
            {this.state.show_mine && this.state.show_masters ? <>
                <br />
                <h2 className="bookTableLabel"><Translator text="Masters" /></h2>
                <br />
            </> : null}
            {this.state.show_masters ? this.mastersBook() : null}
            <br />
            <TogglePanel title="Dataset">
                <CheckBox 
                    text={<Translator text={"My repertoire"} />} 
                    checked={this.state.show_mine} 
                    click={() => this.setState(old => {return {show_mine: !old.show_mine}})}
                />
                <br />
                <CheckBox 
                    text={<Translator text={"Masters games"} />} 
                    checked={this.state.show_masters} 
                    click={() => this.setState(old => {return {show_masters: !old.show_masters}})}
                />
            </TogglePanel>
            {this.state.show_mine ? this.filtersSection() : null}
        </React.Fragment>
        
    }
}

function getMoveNumbering(number) {
    if(number % 2 !== 0) { 
        number = (Math.floor(number/2) + 1) + " ..."
    }else{
        number = (number/2 + 1) + "."
    }
    return number
}

let master_games_cache = {}

function get_lichess_master_games(fromtos){
    let str = fromtos.join(",")

    if(master_games_cache[str] !== undefined) return master_games_cache[str];

    let url = "https://explorer.lichess.ovh/masters?play=" + str
    let startTime = new Date()
    let fetchPromise = fetch(url).then(data => data.json()).then(async (json)=>{
        const sleep = (ms)=>new Promise(resolve=>setTimeout(()=>resolve(),ms))
        const delta = 150 - (new Date()-startTime)
        if (delta>0)
            await sleep(delta)

        return json
    })
    let res = wrapPromise(fetchPromise.then(res => res))

    master_games_cache[str] = res

    return res;
}

function wrapPromise(promise) {
    let status = "pending";
    let result;
    let suspender = promise.then(
        r => {
        status = "success";
        result = r;
        },
        e => {
        status = "error";
        result = e;
        }
    );
    return {
        read() {
        if (status === "pending") {
            throw suspender;
        } else if (status === "error") {
            throw result;
        } else if (status === "success") {
            return result;
        }
        }
    };
}

class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };
    static getDerivedStateFromError(error) {
      return {
        hasError: true,
        error
      };
    }
    render() {
      if (this.state.hasError) {
        return this.props.fallback;
      }
      return this.props.children;
    }
}

class MasterGames extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let res = this.props.getMastersMovesRes.read()

        if(res.error) return null
     
        // let get_winrate = m => {
        //     let total = m.white + m.black + m.draws
        //     let nicer = p => Math.round(p*100).toString() + "%"
        //     return nicer(m.white / total) +  " " + nicer(m.draws / total) +  " " + nicer(m.black / total)
        // }

        let get_winrate_gradient = m => {
            let total = m.white + m.black + m.draws
            let white = Math.round(m.white/total*100)
            let black = Math.round(m.black/total*100)
            let draws = 100 - white - black

            let wcolor = "white"
            let dcolor = "gray"
            let bcolor = "black"

            return `-webkit-linear-gradient(left, ${wcolor} 0%, ${wcolor} ${white}%, ${dcolor} ${white}%, ${dcolor} ${white+draws}%, ${bcolor} ${white+draws}%, ${bcolor} 100%)`
        }

        let nicer_count = count => {
            let order = Math.floor(Math.log10(count))
            let digit = Math.floor(count / Math.pow(10, order)) 

            let order_str;
            switch (order) {
                case 0:
                    order_str = ""
                    break;
                case 1:
                    order_str = "0"
                    break;
                case 2:
                    order_str = "00"
                    break;
                case 3:
                    order_str = "k"
                    break;
                case 4:
                    order_str = "0k"
                    break;
                case 5:
                    order_str = "00k"
                    break;
                case 6:
                    order_str = "M"
                    break;
                case 7:
                    order_str = "0M"
                    break;
                case 8:
                    order_str = "00M"
                    break;
                case 9:
                    order_str = "B"
                    break;
                default:
                    order_str = "0".repeat(9-order) + "B"
                    break;
            }

            return (order > 0 ? "~" : "") + digit.toString() + order_str;
        }
        
        let number = getMoveNumbering(this.props.moves_count)
        res = res.moves.map(m =>
            <tr onClick={() => this.props.book_move(m.san)} key={`master_move_${m.san}_${this.props.moves_count}`}>
                <td className="bookTableNumber">{number}</td>
                <td className="bookTableSan" dangerouslySetInnerHTML={{__html: make_san_nicer_html(m.san)}}></td>
                <td>{m.averageRating}</td>
                <td>
                    <div 
                        className="winrateBar" 
                        style={{backgroundImage: get_winrate_gradient(m)}}
                    />
                </td>
                <td>{nicer_count(m.white + m.black + m.draws)}</td>
            </tr>
        )

        return res
    }
}

export default BookUI
