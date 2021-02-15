import React, { Component } from "react"
import Chess from "../chessjs-chesstutor/chess.js"

import { cells, cells_rotated, cell_coords, cell_coords_rotated, pieces_names, sub_names } from "../utilities/pieces_and_coords"
import { get_piece_src, get_board_svg, get_board_rotated_svg, sound_capture, sound_move, sound_error } from "../utilities/file_paths"

import PromotionModal from "../components/PromotionModal"
import CommentModal from "../components/CommentModal"
import HelpModal from "../components/HelpModal"
import NewVariModal from "./NewVariModal.js"
import HangingMenu from "../components/HangingMenu"
import VariationAddedModal from "../components/VariationAddedModal"
import TrainingFinishedModal from "../components/TrainingFinishedModal"

import Ripples from "react-ripples"
import BoardData from "../components/BoardData"
import Arrows from "../components/Arrows"

import "../styles/Board.css"

let stockfish;
let stockfish_asked = 0;
let stockfish_request_time = new Date();

let clientX_down = 0
let clientY_down = 0
let left_mouse_down = false
let on_drag = false
let dragged_away = false

let move_audio
let capture_audio
let error_audio

class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      game: new Chess(),
      json_moves: [], // moves' history in the correct format (see vari.moves)
      selected_cell: undefined, // undefined or "d4"
      variNameModalVisible: false,
      new_vari_name: "",
      rotated: this.props.rotation === "black" ? true : false,
      promotionModalVisible: false,
      promotionPromiseResRes: undefined,
      commentModalVisible: false,
      helpModalVisible: false,
      helpModalCorrectMoves: [],
      moves_forward: [],
      arrows: [],
      variationAddedNames: {
        name: "",
        subname: "",
      },
      stockfish_evaluation: undefined,
      stockfish_calculated_depth: 0,
    }
    /* functions */
    this.newGame = this.newGame.bind(this)
    this.testChess = this.testChess.bind(this)
    this.selectCell = this.selectCell.bind(this)
    this.deselectCells = this.deselectCells.bind(this)
    this.boardClick = this.boardClick.bind(this)
    this.clickCell = this.clickCell.bind(this)
    this.try_undo = this.try_undo.bind(this)
    this.closeVariNameModal = this.closeVariNameModal.bind(this);
    this.openVariNameModal = this.openVariNameModal.bind(this);
    this.createThisVariation = this.createThisVariation.bind(this);
    this.boardDown = this.boardDown.bind(this);
    this.boardUp = this.boardUp.bind(this);
    this.boardDrag = this.boardDrag.bind(this);
    this.touchCircle = this.touchCircle.bind(this)
    this.boardButtons = this.boardButtons.bind(this)
    this.pc_move = this.pc_move.bind(this)
    this.try_select_cell = this.try_select_cell.bind(this)
    this.getPromotion = this.getPromotion.bind(this)
    this.onCommentClick = this.onCommentClick.bind(this)
    this.next_button_click = this.next_button_click.bind(this)
    this.help_button_click = this.help_button_click.bind(this)
    this.make_move = this.make_move.bind(this)
    this.back_button_click = this.back_button_click.bind(this)
    this.is_my_turn = this.is_my_turn.bind(this)
    this.forward_next_button_click = this.forward_next_button_click.bind(this)
    this.setArrows = this.setArrows.bind(this)
    this.makeCongrats = this.makeCongrats.bind(this)
    this.start_stockfish = this.start_stockfish.bind(this)
    this.close_stockfish = this.close_stockfish.bind(this)
    this.stockfish_move = this.stockfish_move.bind(this)
    this.stockfish_find_best_moves = this.stockfish_find_best_moves.bind(this)
    this.stockfish_evaluate = this.stockfish_evaluate.bind(this)
    this.stockfish_automatics = this.stockfish_automatics.bind(this)
    this.stockfish_go_deeper = this.stockfish_go_deeper.bind(this)
    this.get_lichess_cloud_evaluation = this.get_lichess_cloud_evaluation.bind(this)
    /* refs */
    this.selectedPiece = React.createRef()

    move_audio = new Audio(sound_move)
    capture_audio = new Audio(sound_capture)
    error_audio = new Audio(sound_error)
  }

  /* ---------------------------- COMPONENT ---------------------------- */

  render() {
    let thereIsComment = !(this.props.op_index === undefined || !this.state.json_moves) ? this.props.getComment(this.props.op_index, this.state.json_moves) : false

    return (
      <React.Fragment>
        {/* --------------------------------------- BOARD --------------------------------------- */}

        <div id="boardGrid" key="boardGrid">
          <div id="boardContainer"
            ref={"bContainer"}
            key="boardContainer"

            onTouchStart={this.boardDown}
            onTouchEnd={this.boardUp}
            onTouchMove={this.boardDrag}
            onMouseDown={this.boardDown}
            onMouseMove={this.boardDrag}
            onMouseUp={this.boardUp}
            draggable={false}
          >
            {this.selection()}
            {this.touchCircle()}
            {this.pieces()}
            <Arrows arrows={this.state.arrows} rotated={this.state.rotated} />
            <img id="boardSVG" src={this.state.rotated ? get_board_rotated_svg() : get_board_svg()} alt={"Board file missing"} ref="board" key="board" draggable={false} />
          </div>
          <div id="boardUI" key="boardUI">
            {this.boardButtons()}
          </div>
          <BoardData
            tabIcons={
              this.props.stockfish ?
                ["book", "computer"]
                :
                ["list"] // , "comment"
            }
            thereIsComment={thereIsComment}
            onCommentClick={this.onCommentClick}
            getComment={this.props.getComment}
            op_index={this.props.op_index}
            json_moves={this.state.json_moves}
            stockfish={this.props.stockfish}
            switch_stockfish={() => {
              this.props.switch_stockfish(() => {
                if (!this.is_my_turn()/* && (this.props.stockfish ? this.props.stockfish.makes_moves : false)*/) {
                  this.stockfish_move(this.state.json_moves)
                }
              })
            }}
            switch_auto_eval={() => {
              this.setState({stockfish_evaluation: undefined})
              this.props.switch_auto_eval(() => {
                if (this.props.stockfish) {
                  if (this.props.stockfish.auto_eval) {
                    this.stockfish_evaluate(this.state.json_moves)
                  }
                }
              })
            }}
            switch_auto_best_move={() => {
              this.props.switch_auto_best_move(() => {
                if (this.props.stockfish) {
                  if (this.props.stockfish.auto_best_move) {
                    this.stockfish_find_best_moves(this.state.json_moves)
                  } else {
                    this.setArrows([])
                    this.setState({ stockfish_chosen_move: undefined })
                  }
                }
              })
            }}
            stockfish_find_best_moves={() => this.stockfish_find_best_moves(this.state.json_moves)}
            stockfish_evaluate={() => this.stockfish_evaluate(this.state.json_moves)}
            stockfish_evaluation={this.state.stockfish_evaluation}
            stockfish_chosen_move={this.state.stockfish_chosen_move}
            stockfish_calculated_depth={this.state.stockfish_calculated_depth}
            set_stockfish_depth={depth => {
              this.props.set_stockfish_depth(depth)
              if (this.props.stockfish.auto_eval || this.props.stockfish.auto_best_move) {
                this.stockfish_go_deeper(depth)
              }
            }}
            get_correct_moves_data_book={this.props.get_correct_moves_data_book}
            book_move={move => this.make_move(move)}
            get_fen={this.state.game.fen}
          />
        </div>


        {/* --------------------------------------- MODALS --------------------------------------- */}

        {/* CREATE NEW VARIATION MODAL */}
        <NewVariModal
          close={this.closeVariNameModal}
          visible={this.state.variNameModalVisible}
          createThisVariation={this.createThisVariation}
          op_index={this.props.op_index}
          getOpFreeSubnames={this.props.getOpFreeSubnames}
        />

        {/* CHOOSE PROMOTION PIECE MODAL */}
        <PromotionModal
          color={this.state.game.turn()}
          visible={this.state.promotionModalVisible}
          close={() => this.setState({ promotionModalVisible: false })}
          promotionPromiseRes={this.state.promotionPromiseRes}
        />

        {/* COMMENT MODAL */}
        {this.state.commentModalVisible ? <CommentModal
          visible={this.state.commentModalVisible}
          close={() => this.setState({ commentModalVisible: false })}
          editComment={this.props.editComment}
          setDrawBoardPDF={this.props.setDrawBoardPDF}
          getDrawBoardPDF={this.props.getDrawBoardPDF}
          getComment={this.props.getComment}
          op_index={this.props.op_index}
          json_moves={this.state.json_moves}
        /> : null}

        {/* HELP MODAL */}
        {(this.props.buttons.indexOf("help") !== -1 || this.props.buttons.indexOf("multi_next") !== -1) && this.state.helpModalVisible ? <HelpModal
          visible={this.state.helpModalVisible}
          close={() => this.setState({ helpModalVisible: false })}
          correct_moves={this.state.helpModalCorrectMoves}
          make_move={this.make_move}
          playColor={this.props.playColor}
          pc_move={this.pc_move}
          op_index={this.props.op_index}
          vari_index={this.props.vari_index}
          json_moves_length={this.state.json_moves.length}
        /> : null}

        {/* MORE MENU */}
        <HangingMenu visible={this.state.boardMenuVisible} close={() => this.setState({ boardMenuVisible: false })}>
          {/* ROTATE BOARD */}
          {this.props.moreMenuButtons.indexOf("flip") !== -1 ?
            <button className="simpleButton hMenuButton" onClick={() => {
              this.setState({ boardMenuVisible: false })
              //this.props.history.push("/analysis/" + this.props.rotation + "/" + this.state.game.fen().split("/").join("_"))
              //this.props.history.push("/analysis/" + this.props.rotation + "/" + this.state.game.pgn().split(" ").join("_"))
              this.setState(old => {return{rotated: !old.rotated}})
            }}>
              <div className="hMenuButtonContent">
                <div className="hMenuButtonIcon">import_export</div>
                <div className="hMenuButtonLabel">Flip</div>
              </div>
            </button> : null
          }
          {/* ANALYSIS BUTTON */}
          {this.props.moreMenuButtons.indexOf("analyse") !== -1 ?
            <button className="simpleButton hMenuButton" onClick={() => {
            this.setState({ boardMenuVisible: false })
            //this.props.history.push("/analysis/" + this.props.rotation + "/" + this.state.game.fen().split("/").join("_"))
            //this.props.history.push("/analysis/" + this.props.rotation + "/" + this.state.game.pgn().split(" ").join("_"))
            const moves = JSON.stringify(this.state.json_moves)
            this.props.history.push("/analysis/" + this.props.rotation + "/" + moves)
          }}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">edit</div>
              <div className="hMenuButtonLabel">Analyse position</div>
            </div>
          </button> : null
          }
        </HangingMenu>

        {/* YOU ADDED A VARIATION! */}
        <VariationAddedModal
          visible={this.state.variationAddedModalVisible}
          close={() => this.setState({ variationAddedModalVisible: false })}
          added_vari_names={this.state.variationAddedNames}
          op_index={this.props.op_index}
          history={this.props.history}
        />

        {/* TRAINING FINISHED! */}
        <TrainingFinishedModal
          visible={this.state.trainingFinishedModalVisible}
          close={() => this.setState({ trainingFinishedModalVisible: false })}
          op_index={this.props.op_index}
          history={this.props.history}
        />
      </React.Fragment>
    )
  }

  componentDidMount() {
    // called when the component is first created
    // this.testChess() // test

    if (this.props.startMoves) {
      /*const fen = this.props.startFen.split("_").join("/")*/
      /*const turn = this.state.game.load(fen)*/

      let moves = JSON.parse(this.props.startMoves);
      moves.forEach(m => this.state.game.move(m.san))
      this.setState({ json_moves: moves })
      this.forceUpdate()
    }

    // pc make first move if the player playes as black
    if (this.props.playColor === "black") {
      if (this.props.stockfish ? this.props.stockfish.makes_moves : false) {
        this.stockfish_move([])
      } else {
        this.pc_move(this.props.op_index, [])
      }
    }
  }

  componentWillUnmount() {
    this.close_stockfish()
  }

  /* ---------------------------- DEBUG ---------------------------- */

  testChess() {
    this.make_move("d4")
    this.make_move("d5")
    this.make_move("e4")
    this.make_move("dxe4")
    this.state.game.undo()
    this.logBoard()
    this.state.game.undo()
    this.logBoard()
    this.make_move("h3")
    this.make_move("h5")
    this.state.game.undo()
    this.logBoard()
    console.log(this.state.game.board())
  }

  logBoard() {
    console.log(this.state.game.ascii())
  }

  /* ---------------------------- GAME MANAGEMENT ---------------------------- */

  newGame() {
    this.setState(
      old => {
        return {
          game: new Chess(),
          json_moves: []
        }
      },
      () => {
        console.log("New game created")
        return
      }
    )
  }

  is_my_turn(turn = this.state.game.turn(), both_allowed = true) {
    if (
      (this.props.playColor === "black" && turn === "b") ||
      (this.props.playColor === "white" && turn === "w") ||
      (this.props.playColor === "both" && both_allowed)
    ) {
      return true
    }
    return false
  }

  is_move_legal(move_data) {
    // as default move_data.from = this.state.selectedCell
    if (move_data.from === undefined) {
      if (this.state.selected_cell === undefined) { return false }
      move_data.from = this.state.selected_cell
    }
    // is it legal?
    let legal_moves = this.state.game.moves({ square: move_data.from, verbose: true }).map(cur => cur.to)
    return legal_moves.includes(move_data.to)
  }

  async make_move(move_data) {
    let move = this.state.game.move(move_data)

    this.play_move_sound(move)
    this.setArrows([])
    this.setState({ stockfish_evaluation: undefined, stockfish_chosen_move: undefined, setCalculatedDepth: 0 })

    return new Promise(res => {
      this.setState(old => {
        if (!move) return; // the move was aborted (for example with the back button)

        let moves_list = old.json_moves
        // adding the new move to the history array in the correct format
        moves_list.push({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
          san: move.san,
        })
        // store moves_list to return it later
        res(moves_list)

        this.stockfish_automatics(moves_list)

        // if the move is not the one you came back from clear the history otherwise remove that move from the history
        let clearMovesForward = true
        if (old.moves_forward[0]) {
          clearMovesForward = move.san !== old.moves_forward[0].san
        }
        if (clearMovesForward) {
          return {
            json_moves: moves_list,
            moves_forward: []
          }
        } else {
          let new_moves_forward = old.moves_forward
          new_moves_forward.shift() // remove first
          return {
            json_moves: moves_list,
            moves_forward: new_moves_forward,
          }
        }
      }, () => {
        // scroll the tree to the bottom after the state got updated
        let tree = document.getElementById("boardDataTreeSlide");
        if (tree) tree.scrollTop = tree.scrollHeight;
      })
    })

  }

  async try_move(move_data) {
    // move data is an object: {from: "d2", to: "d5", promotion: undefined}
    // as default move_data.from = this.state.selectedCell

    if (!this.is_my_turn(this.state.game.turn())) {
      console.log("You can't move during the computer's turn.")
      return false;
    }

    if (move_data.from === undefined) {
      if (this.state.selected_cell === undefined) { return false }
      move_data.from = this.state.selected_cell
    }

    if (this.is_move_legal(move_data)) {
      if (this.is_move_promotion(move_data)) {
        let promotion = await this.getPromotion() // "q" TODO -- decide which piece to promote to
        if (!promotion) {
          return false
        }
        move_data.promotion = promotion
      }

      let move_allowed = true
      if (this.props.is_move_allowed) { // TODO - should check if it is not the turn of the computer
        // if the function exists try and see if this move is allowed(i don't mean illegal, if the move cannot be done for other reasons)
        move_allowed = this.props.is_move_allowed(this.props.op_index, this.state.json_moves, move_data, this.props.vari_index) // if var_index exists it looks only into it
      }
      // works in COLOR_TRAINING_MODE
      if (this.props.is_move_allowed_color) {
        move_allowed = this.props.is_move_allowed_color(this.props.trainColor, this.state.json_moves, move_data)
      }
      // works in GROUP_TRAINING_MODE
      if (this.props.is_move_allowed_group) {
        move_allowed = this.props.is_move_allowed_group(this.props.op_index, this.state.json_moves, move_data, this.props.trainGroup)
      }


      if (move_allowed) { // allowed as default
        // MAKE THE MOVE
        let moves_list_after = await this.make_move(move_data)
        if (this.props.playColor !== "both") {
          if (this.props.stockfish ? this.props.stockfish.makes_moves : false) {
            this.stockfish_move(moves_list_after)
          } else {
            this.pc_move(this.props.op_index, moves_list_after, this.props.vari_index)
          }
        }
      } else {
        this.play_error_sound()
        return false
      }

      return true
    } else {
      return false
    }
  }

  is_move_promotion(move_data) {
    let piece = this.state.game.get(move_data.from)
    if (piece.type !== "p") return false
    if (piece.color === "w" && move_data.from[1] === "7") return true
    if (piece.color === "b" && move_data.from[1] === "2") return true
    return false
  }

  getPromotion() {
    return new Promise((res, rej) => {
      this.setState({ promotionPromiseRes: res, promotionModalVisible: true })
    })
  }

  try_undo() {
    /* I can undo if there is some move to undo */
    if (this.state.json_moves.length > 0) {
      if (this.state.json_moves.length === 1 && this.props.playColor === "black") {
        return;
      }
      // actually undo
      let move = this.state.game.undo()
      // remove arrows in case there were any
      this.setArrows([])
      // pop the move out of the list of all moves of the game 
      this.setState(old => {
        // add this move to moves_forward
        // remove it from json_moves
        let moves_list = old.json_moves
        moves_list.pop()

        this.stockfish_automatics(moves_list)

        return {
          json_moves: moves_list,
          moves_forward: [move, ...old.moves_forward],
          stockfish_chosen_move: undefined
        }
      })
    } else {
      console.log("Cannot undo before any move is done")
    }
  }

  pc_move(op_index, json_moves, vari_index = undefined) {
    /*if (this.is_my_turn(this.state.game.turn())) {
      console.log("The computer can't move during the player's turn.")
      return;
    }*/

    let move_data = this.props.get_pc_move_data ? this.props.get_pc_move_data(op_index, json_moves, vari_index) : null
    if (this.props.trainColor !== undefined) {
      // works with COLOR_TRAINING_MODE
      move_data = this.props.get_pc_move_data_color(this.props.trainColor, json_moves)
    } else if (this.props.trainGroup !== undefined) {
      // works with GROUP_TRAINING_MODE
      move_data = this.props.get_pc_move_data_group(op_index, json_moves, this.props.trainGroup)
    }

    if (move_data !== null) {
      setTimeout(async () => {
        // the pc makes his move
        let pc_move_data = await await this.make_move(move_data)

        // now that pc has moved is the training finished?
        let correct_moves_repetitive = []
        if (this.props.trainColor === undefined && this.props.trainGroup === undefined) {
          correct_moves_repetitive = this.props.get_correct_moves_data(this.props.op_index, pc_move_data, this.props.vari_index)
        } else if (this.props.trainColor !== undefined) { // works with COLOR_TRAINING_MODE
          correct_moves_repetitive = this.props.get_correct_moves_data_color(this.props.trainColor, pc_move_data)
        } else if (this.props.trainGroup !== undefined) { // works with GROUP_TRAINING_MODE
          correct_moves_repetitive = this.props.get_correct_moves_data_group(this.props.op_index, pc_move_data, this.props.trainGroup)
        }

        if (correct_moves_repetitive.length === 0) {
          // training finished
          this.makeCongrats()
        }

      }, this.props.wait_time)
    } else {
      this.makeCongrats()
    }
  }

  close_stockfish() {
    if (stockfish) {
      stockfish.terminate()
    }
    stockfish_asked = 0;
    stockfish = undefined;
  }

  /* ---------------------------- STOCKFISH AND CLOUD EVALUATION ---------------------------- */

  start_stockfish() {

    if (!(typeof (Worker))) {
      console.log("Workers needs to be supported in order to use Stockfish.") // TODO: notify the user
      return false;
    } 


    let wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

    stockfish = new Worker(wasmSupported ? '/stockfish/stockfish.wasm.js' : '/stockfish/stockfish.js');

    let make_this_move = move => this.make_move(move)
    let is_my_turn_now = () => this.is_my_turn(this.state.game.turn())
    let stockfish_arrows = () => this.props.stockfish ? this.props.stockfish.show_arrows : false // should always exists
    let setArrows = arr => this.setArrows(arr)
    let setCalculatedDepth = value => this.setState({ stockfish_calculated_depth: value })
    let setEvaluation = value => this.setState({ stockfish_evaluation: value })
    let setChosenMove = value => this.setState({ stockfish_chosen_move: value })
    let wait_time = () => this.props.wait_time
    let auto_eval = () => this.props.stockfish.auto_eval
    let auto_best_move = () => this.props.stockfish.auto_best_move
    let eval_color_factor = () => this.state.game.turn() == "w" ? 1 : -1 

    stockfish.addEventListener('message', async function (event) {
      console.log(event.data)

        // MAKE THE BEST MOVE
        if (event.data.startsWith("bestmove ")) {
          let move = event.data.split(" ")[1]
          if (stockfish_asked === 1 && !is_my_turn_now()) {
            // console.log("BEST " + move)
            let remaining_time = Math.max(wait_time() - (new Date() - stockfish_request_time), 0)
            if (move.length === 4) {
              setTimeout(() => {
                make_this_move({
                  from: move[0] + move[1],
                  to: move[2] + move[3]
                })
              }, remaining_time)
            } else if (move.length === 5) {
              setTimeout(() => {
                make_this_move({
                  from: move[0] + move[1],
                  to: move[2] + move[3],
                  promotion: move[4]
                })
              }, remaining_time)
            }
            else {
              console.log("Unknown move format: " + move)
            }
          } else {
            console.log("LOST CALCULATION " + move)
          }
          stockfish_asked -= 1

          // SHOW WHAT STOCKFISH IS THINKING
        } else if (event.data.startsWith("info depth ") && event.data.indexOf("currmove ") === -1 && stockfish_arrows()) {

          let depth = parseInt(event.data.split(" ")[2])
          setCalculatedDepth(depth)

          if(auto_eval()) {
            let splitted = event.data.split("cp ")
            let data = splitted[splitted.length - 1].split(" ")
            if(data.length >= 1){
              setEvaluation(parseInt(data[0]) / 100 * eval_color_factor())
            }
          }

          if(auto_best_move()){
            let splitted = event.data.split("pv ")
            let moves = splitted[splitted.length - 1].split(" ").map(m => {
              return {
                from: m[0] + m[1],
                to: m[2] + m[3]
              }
            })

            // if it contains currmove
            /*
            let splitted = event.data.slice(currmove, event.data.length).split(" ")
            moves = [{
              from: splitted[1][0] + splitted[1][1],
              to: splitted[1][2] + splitted[1][3]
            }]
            */
  
            setArrows(moves ? [moves[0]] : [])
            setChosenMove(moves ? moves[0].from + "-" + moves[0].to : undefined)
          
          }


          // EVALUATE POSITION
        } else if (event.data.startsWith("Total Evaluation: ")) {
          let splitted = event.data.split(" ")
          if (splitted.length >= 3) {
            let value = splitted[2]
            setEvaluation(parseFloat(value))
          }
        } else if(event.data.startsWith("uciok")){
          stockfish.postMessage("setoption name UCI_AnalyseMode value true");
          stockfish.postMessage("setoption name Analysis Contempt value Off");
        }
    });

    stockfish.postMessage("uci")

  }

  stockfish_move(json_moves) {
    if (!stockfish) {
      this.start_stockfish()
    }

    stockfish.postMessage("stop")
    stockfish.postMessage("ucinewgame")

    if(JSON.stringify(this.state.json_moves) === JSON.stringify(json_moves)){
      stockfish.postMessage("position fen " + this.state.game.fen())
    }else{
      stockfish.postMessage("position startpos moves " + json_moves.map(c => c.from + c.to + (c.promotion ? c.promotion : "")).join(" "))
    }

    stockfish.postMessage("go depth " + this.props.stockfish.depth)

    stockfish_asked += 1
    if (new Date() - stockfish_request_time > 500) {
      stockfish_request_time = new Date()
    }
  }


  stockfish_go_deeper(depth = this.props.stockfish.depth) {
    if (!stockfish) {
      return
    }

    stockfish.postMessage("go depth " + depth)

    stockfish_asked += 1
  }

  async get_lichess_cloud_evaluation(json_moves){
    let fen;
    let possible_moves;

    if(JSON.stringify(this.state.json_moves) === JSON.stringify(json_moves)){
      fen = this.state.game.fen()
      possible_moves = this.state.game.moves()
    }else{
      let eval_game = new Chess();
      json_moves.map(m => eval_game.move(m.san))
      fen = eval_game.fen()
      possible_moves = eval_game.moves()
    }


    const en_passant = fen.split(/ /g, )[3]
    if(en_passant !== "-"){
      if(possible_moves.filter(m => m.piece === "p" && m.flag === "e").length === 0){
        fen = fen.replace(" " + en_passant + " ", " - ")
      }
    }

    let url = "https://lichess.org/api/cloud-eval?fen=" + fen.replace(/ /g, "%20")
    let eval_data = await (fetch(url).then(data => data.json()).then(res => res))

    return eval_data
  }

  async stockfish_find_best_moves(json_moves, lichess_eval_data, depth = this.props.stockfish.depth) {
    const eval_data = lichess_eval_data ? lichess_eval_data : await this.get_lichess_cloud_evaluation(json_moves)
    
    if(eval_data.error || eval_data.depth < depth){
      if (!stockfish) {
        this.start_stockfish()
      }
  
      stockfish.postMessage("stop")
      stockfish.postMessage("ucinewgame")
      
      if(JSON.stringify(this.state.json_moves) === JSON.stringify(json_moves)){
        stockfish.postMessage("position fen " + this.state.game.fen())
      }else{
        stockfish.postMessage("position startpos moves " + json_moves.map(c => c.from + c.to + (c.promotion ? c.promotion : "")).join(" "))
      }

      stockfish.postMessage("go depth " + depth)
  
      stockfish_asked += 1
    }else{
      const move_str = eval_data.pvs[0].moves.split(" ")[0]
      this.setState({ stockfish_chosen_move: move_str[0] + move_str[1] + "-" + move_str[2] + move_str[3] })
      this.setArrows([{
        from: move_str[0] + move_str[1],
        to: move_str[2] + move_str[3]
      }])
    }


  }


  async stockfish_evaluate(json_moves, lichess_eval_data, depth = this.props.stockfish.depth) {
    const eval_data = lichess_eval_data ? lichess_eval_data : await this.get_lichess_cloud_evaluation(json_moves)

    if(eval_data.error || eval_data.depth < depth){
      // evaluate locally
      if (!stockfish) {
        this.start_stockfish()
      }
  
      stockfish.postMessage("stop")
      stockfish.postMessage("ucinewgame")

      if(JSON.stringify(this.state.json_moves) === JSON.stringify(json_moves)){
        stockfish.postMessage("position fen " + this.state.game.fen())
      }else{
        stockfish.postMessage("position startpos moves " + json_moves.map(c => c.from + c.to + (c.promotion ? c.promotion : "")).join(" "))
      }

      // stockfish.postMessage("eval")
      stockfish.postMessage("go depth " + depth)
    }else{
      this.setState({ stockfish_evaluation: eval_data.pvs[0].cp / 100, stockfish_calculated_depth: eval_data.depth })
    }

  }

  async stockfish_automatics(json_moves) {
    if (this.props.stockfish) {
      if(this.props.stockfish.auto_eval && this.props.stockfish.auto_best_move){  
        // evaluate position and find the best move if needed
        const eval_data = await this.get_lichess_cloud_evaluation(json_moves)
        this.stockfish_evaluate(json_moves, eval_data)
        this.stockfish_find_best_moves(json_moves, eval_data)
      }else if (this.props.stockfish.auto_eval) {
        // evaluate position if needed
        this.stockfish_evaluate(json_moves)
      }else if (this.props.stockfish.auto_best_move && this.is_my_turn()) {
        // find best move if needed
        this.stockfish_find_best_moves(json_moves)
      }
    }
  }

  /* ---------------------------- BOARD MANAGEMENT ---------------------------- */

  cellCoordinates(cell, rotated = this.state.rotated || false) {
    const letter = cell[0]
    const number = cell[1]
    if (!rotated) {
      return { x: cells[letter], y: cells[number] }
    } else {
      return { x: cells_rotated[letter], y: cells_rotated[number] }
    }
  }

  pieceObj(type, cell, id) {
    let coor = cell // cell can be {x: "100%", y: "300%"} or "d4"
    let cell_str
    if (typeof cell === "string") {
      coor = this.cellCoordinates(cell)
      cell_str = cell
    } else {
      cell_str = this.cellFromCoor(coor) /* , false */
    }

    const svg = get_piece_src(type)
    const is_selected = this.state.selected_cell === cell_str
    return <img
      style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }}
      src={svg}
      id={"piece" + id}
      key={"piece" + id}
      ref={is_selected ? this.selectedPiece : null}
      className={is_selected ? "pieceSVG noAnimationPiece" : "pieceSVG staticPiece"} /* && on_drag  */
      alt={"Piece file missing"}
      draggable={false}
    />
  }

  pieces(rotated = this.state.rotated || false) {
    let objects = []
    let board = this.state.game.board()
    for (let line = 0; line < 8; line++) {
      for (let collumn = 0; collumn < 8; collumn++) {
        // get the piece from the array
        let piece = board[line][collumn]
        if (piece !== null) {
          // if the cell is not empty
          let type = pieces_names[piece.color === "b" ? piece.type : piece.type.toUpperCase()] // get the type in this form: "white_king"
          if (!rotated) {
            objects.push({ collumn, line, type, id: piece.id })
          } else {
            objects.push({ collumn: 7 - collumn, line: 7 - line, type, id: piece.id })
          }
        }
      }
    }
    objects.sort((a, b) => a.id - b.id) // sort pieces to avoid errors with chrome. unecessary with edge
    return objects.map(({ collumn, line, id, type }) => this.pieceObj(type, { x: `${collumn * 100}`, y: `${line * 100}` }, id)) // get the piece object
  }

  selection() {
    let sel = this.state.selected_cell
    let piece = this.state.game.get(sel)
    if (sel === undefined || !piece) return <div key="selection" id="selection" />

    let coor = this.cellCoordinates(sel)
    let type = pieces_names[piece.color === "b" ? piece.type : piece.type.toUpperCase()]
    return <img style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} src={get_piece_src(type)} className="selection" key="selection" id="selection" alt="selection" />
  }

  touchCircle() {
    let over = this.state.mouse_over_cell
    let sel = this.state.selected_cell
    if (over === undefined || sel === undefined || !dragged_away) return <div key="touchCircle" />

    let coor = this.cellCoordinates(over)
    coor.x = coor.x / Math.sqrt(2) - 100 / 8
    coor.y = coor.y / Math.sqrt(2) - 100 / 8

    return <div style={{ transform: `translate(calc(${coor.x}% - 2px), calc(${coor.y}% - 4px))` }} key="touchCircle" id="touchCircle" />
    // return <div style={{ transform: `translate(${coor.x/1.5 - 17.25}%, ${coor.y/1.5 - 19.75}%)` }} key="touchCircle" id="touchCircle" />

    /*if(!this.state.selected_cell || !on_drag) return <div key="touchCircle" ref={this.touchCircleRef} />
    let coor = this.cellCoordinates(this.cellFromCoor(this.state.selected_cell))
    return <div id="touchCircle" ref={this.touchCircleRef} key="touchCircle" style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} />*/
  }

  cellFromCoor(coor, rotated = this.state.rotated || false) {
    // coor: {x: "100", y: "700"}
    if (!rotated) {
      return cell_coords[coor.x + "x"] + cell_coords[coor.y + "y"]
    } else {
      return cell_coords_rotated[coor.x + "x"] + cell_coords_rotated[coor.y + "y"]
    }
  }

  selectCell(cell) {
    // cell: "d4"
    this.setState({ selected_cell: cell }, () => {
      if (this.selectedPiece.current) {
        this.selectedPiece.current.style.left = "0px";
        this.selectedPiece.current.style.top = "0px";
      }
    })
  }

  deselectCells() {
    this.setState({ selected_cell: undefined })
  }

  try_select_cell(cell) {
    let cell_obj = this.state.game.get(cell)
    if (cell_obj !== null) {
      if (cell_obj.color === this.state.game.turn()) {
        // for example "black"[0] === "b" => true NB: also "both"[0] works but it's not a problem here
        if (this.props.playColor === "both" || this.props.playColor[0] === cell_obj.color) {
          this.selectCell(cell)
          return true
        }
      }
    }
    this.deselectCells()
    return false
  }

  async clickCell(cell) {
    // if something is selected try to move there
    if (this.state.selected_cell !== undefined) {
      let res = await this.try_move({ from: this.state.selected_cell, to: cell }) // true = move done; false = move not done because illegal
      if (res) {
        // if i have a piece selected and i moved there
        this.deselectCells()
      } else {
        // if i have a piece selected but i couldn't move there
        this.try_select_cell(cell)
      }
    } else {
      // if anything is selected try to selected this cell
      this.try_select_cell(cell)
    }
  }

  boardClick(e) {
    const coor = { x: e.clientX - this.refs.bContainer.offsetLeft, y: e.clientY - this.refs.bContainer.offsetTop }
    coor.x = Math.floor((coor.x / this.refs.board.width) * 8) * 100
    coor.y = Math.floor((coor.y / this.refs.board.width) * 8) * 100
    if (coor.x <= 700 && coor.y <= 700) {
      // inside the board
      const cell = this.cellFromCoor(coor)
      this.clickCell(cell)
    }
  }

  async boardDown(e) {
    let clientX = e.clientX
    let clientY = e.clientY
    if (e.type === "touchstart") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    clientX_down = clientX
    clientY_down = clientY
    const coor = { x: clientX - this.refs.bContainer.offsetLeft, y: clientY - this.refs.bContainer.offsetTop }
    coor.x = Math.floor((coor.x / this.refs.board.width) * 8) * 100
    coor.y = Math.floor((coor.y / this.refs.board.width) * 8) * 100
    if (coor.x <= 700 && coor.y <= 700) {
      // inside the board
      const cell = this.cellFromCoor(coor)

      if (this.state.selected_cell && this.is_move_legal) {
        await this.try_move({ to: cell })
      }

      const selection_res = this.try_select_cell(cell)
      on_drag = selection_res ? true : false
      left_mouse_down = true
      this.setState({ mouse_over_cell: cell })
    }
  }

  async boardUp(e) {
    if (this.state.selected_cell && this.selectedPiece.current) {
      // (both variables) stored here to avoid losing it, before resetting piece offset, by deselecting
      const draggedPiece = this.selectedPiece.current

      // find the coordinates of the mouse
      let clientX = e.clientX
      let clientY = e.clientY
      if (e.type === "touchend") {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
      const coor = { x: clientX - this.refs.bContainer.offsetLeft, y: clientY - this.refs.bContainer.offsetTop }
      coor.x = Math.floor((coor.x / this.refs.board.width) * 8) * 100
      coor.y = Math.floor((coor.y / this.refs.board.width) * 8) * 100

      // inside the board?
      if (coor.x <= 700 && coor.y <= 700) {
        // try to move there
        const cell = this.cellFromCoor(coor)
        const try_move_res = await this.try_move({ to: cell })
        if (!try_move_res && cell) {
          this.try_select_cell(cell)
        } else if (cell) {
          this.deselectCells()
        }
      }

      // reset dragging (it has to be done after everithing otherwise you see the piece come back)
      draggedPiece.style.left = "0px"
      draggedPiece.style.top = "0px"
      /*this.touchCircleRef.current.style.left = "0px"
      this.touchCircleRef.current.style.top = "0px"*/

    }
    clientX_down = 0
    clientY_down = 0
    on_drag = false
    left_mouse_down = false
    dragged_away = false
    this.forceUpdate()
  }

  boardDrag(e) {
    if (this.state.selected_cell && this.selectedPiece.current && left_mouse_down && on_drag) {
      let clientX = e.clientX
      let clientY = e.clientY

      if (e.type === "touchmove") {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      //move piece
      let deltaX = clientX - clientX_down
      let deltaY = clientY - clientY_down
      dragged_away = deltaX !== 0 || deltaY !== 0 || dragged_away

      this.selectedPiece.current.style.left = deltaX + "px"
      this.selectedPiece.current.style.top = deltaY + "px"

      /*this.touchCircleRef.current.style.left = deltaX + "px"
      this.touchCircleRef.current.style.top = deltaY + "px"*/
      // find the coordinates of the mouse
      const coor = { x: clientX - this.refs.bContainer.offsetLeft, y: clientY - this.refs.bContainer.offsetTop }
      coor.x = Math.floor((coor.x / this.refs.board.width) * 8) * 100
      coor.y = Math.floor((coor.y / this.refs.board.width) * 8) * 100

      // inside the board?
      if (coor.x <= 700 && coor.y <= 700) {
        // try to move there
        const cell = this.cellFromCoor(coor)
        this.setState({ mouse_over_cell: cell })
      }
    }
  }

  async play_move_sound(move) {
    // move is what the game.move() function returns
    if (move) {
      if (move.flags.indexOf("c") !== -1 || move.flags.indexOf("e") !== -1) {
        capture_audio.volume = this.props.volume
        capture_audio.play()
      } else {
        move_audio.volume = this.props.volume
        move_audio.play()
      }
    }
  }

  async play_error_sound() {
    move_audio.volume = this.props.volume
    error_audio.play()
  }


  /* ---------------------------- UI ELEMENTS ---------------------------- */

  next_button_click() {
    if (this.props.playColor === "none" || this.is_my_turn()) {
      let move_data = this.props.get_vari_next_move_data(this.props.op_index, this.props.vari_index, this.state.json_moves)
      if (move_data !== null) {
        this.make_move(move_data)
      }
    }
  }

  forward_next_button_click() {
    if (this.state.moves_forward.length > 0) {
      let move_data = this.state.moves_forward[0]
      if (move_data !== null) {
        this.make_move(move_data)
      }
    }
  }

  back_button_click() {
    const before_turn = this.state.game.turn()
    this.try_undo()
    if (this.is_my_turn(before_turn, false)) { // undo twice
      this.try_undo()
    }
  }

  async help_button_click(can_auto_move = false) {
    if (!this.is_my_turn()) return false
    // get moves data [{from: "d2", to: "d4", san: "d4"}, ...]
    let correct_moves_repetitive = []
    if (this.props.trainColor === undefined && this.props.trainGroup === undefined) {
      correct_moves_repetitive = this.props.get_correct_moves_data(this.props.op_index, this.state.json_moves, this.props.vari_index)
    } else if (this.props.trainColor !== undefined) { // works with COLOR_TRAINING_MODE
      correct_moves_repetitive = this.props.get_correct_moves_data_color(this.props.trainColor, this.state.json_moves)
    } else if (this.props.trainGroup !== undefined) { // works with GROUP_TRAINING_MODE
      correct_moves_repetitive = this.props.get_correct_moves_data_group(this.props.op_index, this.state.json_moves, this.props.trainGroup)
    }

    // remove doubles ([d4, d4, e4] -> [d4, e4])
    let correct_moves_names = []
    let correct_moves = []
    correct_moves_repetitive.forEach(element => {
      if (correct_moves_names.indexOf(element.san) === -1) {
        correct_moves_names.push(element.san)
        correct_moves.push(element)
      }
    });

    if (correct_moves.length > 1 || !can_auto_move) {
      /*this.setState({
        helpModalVisible: true,
        helpModalCorrectMoves: correct_moves
      })*/
      this.setArrows(correct_moves)
    } else if (correct_moves.length === 1) {
      // MAKE MOVE
      const moves_list_after = await this.make_move(correct_moves[0])
      // COMPUTER ANSWER IF NECESSARY
      if (this.props.playColor !== "both") {
        if (this.props.stockfish ? this.props.stockfish.makes_moves : false) {
          this.stockfish_move(moves_list_after)
        } else {
          // this.stockfish_move(moves_list_after) // TODO ERROR STOCKFISH TEST -------
          this.pc_move(this.props.op_index, moves_list_after, this.props.vari_index)
        }
      }
    }
  }

  boardButtons() {
    let b_objects = []
    let b_names = []
    if (this.props.buttons) {
      // MORE
      if (this.props.buttons.indexOf("more") !== -1 && this.props.moreMenuButtons.length > 0) {
        b_objects.push(
          <button id="moreButton" key="moreButton" className="simpleButton boardButton"
            onClick={() => {
              this.setState({ boardMenuVisible: true })
            }}
          >more_vert</button>
        )
        b_names.push("moreButton")
      }
      // BACK
      if (this.props.buttons.indexOf("back") !== -1) {
        b_objects.push(
          <button id="backButton" key="backButton" className="simpleButton boardButton"
            onClick={this.back_button_click}
            disabled={this.state.json_moves.length === 0 || (this.state.json_moves.length === 1 && this.props.playColor === "black")}
          >keyboard_arrow_left</button>
        )
        b_names.push("backButton")
      }
      // HELP
      if (this.props.buttons.indexOf("help") !== -1) {
        b_objects.push(
          <button id="helpButton" key="helpButton" className="simpleButton boardButton"
            onClick={() => this.help_button_click(false)}
            disabled={!this.is_my_turn()}
          >help</button>
        )
        b_names.push("helpButton")
      }
      // SINGLE NEXT
      if (this.props.buttons.indexOf("single_next") !== -1) {
        b_objects.push(
          <button id="nextButton" key="nextButton" className="simpleButton boardButton"
            onClick={this.next_button_click}
            disabled={(!this.is_my_turn() && !this.props.playColor === "none") || !this.props.get_vari_next_move_data(this.props.op_index, this.props.vari_index, this.state.json_moves)}
          >keyboard_arrow_right</button>
        )
        b_names.push("nextButton")
      }
      // MULTI NEXT - search in all non archived variations
      if (this.props.buttons.indexOf("multi_next") !== -1) {
        b_objects.push(
          <button id="multiNextButton" key="multiNextButton" className="simpleButton boardButton"
            onClick={() => this.help_button_click(true)}
            disabled={!this.is_my_turn()}
          >keyboard_arrow_right</button>
        )
        b_names.push("multiNextButton")
      }
      // FORWARD NEXT
      if (this.props.buttons.indexOf("forward_next") !== -1) {
        b_objects.push(
          <button id="forwardNextButton" key="forwardNextButton" className="simpleButton boardButton"
            onClick={this.forward_next_button_click}
            disabled={this.state.moves_forward.length < 1}
          >keyboard_arrow_right</button>
        )
        b_names.push("forwardNextButton")
      }
      // COMMENT THIS MOVE
      if (this.props.buttons.indexOf("add_comment") !== -1) {
        b_objects.push(
          <button id="addCommentButton" key="addCommentButton" className="simpleButton boardButton"
            onClick={this.onCommentClick}
            disabled={false}
          >comment</button>
        )
        b_names.push("addCommentButton")
      }
      // CREATE VARIATION BUTTON - DONE
      if (this.props.buttons.indexOf("done") !== -1) {
        b_objects.push(
          <button id="doneButton" key="doneButton" className="simpleButton boardButton"
            // onClick={this.openVariNameModal}
            onClick={() => {
              const allowed_subnames = this.props.getOpFreeSubnames(this.props.op_index, this.props.vari_name, sub_names)
              const sub_name = allowed_subnames[0] !== undefined || allowed_subnames.length === 1 ? allowed_subnames[0] : allowed_subnames[1]
              this.createThisVariation(this.props.vari_name, sub_name)
            }}
            disabled={this.state.json_moves.length === 0}
          >add</button>
        )
        b_names.push("doneButton")
      }
      // STOP TRAINING THIS OPENING
      if (this.props.buttons.indexOf("stopTrainThis") !== -1) {
        b_objects.push(
          <button id="stopTrainThisButton" key="stopTrainThisButton" className="simpleButton boardButton alertButton"
            onClick={() => this.props.set_in_training(false)}
          >clear</button>
        )
        b_names.push("stopTrainThisButton")
      }
      // TRAIN THIS OPENING
      if (this.props.buttons.indexOf("trainThis") !== -1) {
        b_objects.push(
          <button id="trainThisButton" key="trainThisButton" className="simpleButton boardButton impButton"
            onClick={() => {
              let newPlayColor = this.props.set_in_training(true)
              if (
                (newPlayColor === "black" && this.state.json_moves.length % 2 === 0) ||
                (newPlayColor === "white" && this.state.json_moves.length % 2 === 1)
              ) { // if it's the turn of the pc to move
                this.pc_move(this.props.op_index, this.state.json_moves, this.props.vari_index)
              }
            }}
          >school</button>
        )
        b_names.push("trainThisButton")
      }
    }
    return b_objects.map((button, i) => <Ripples className="simpleButton boardButton" key={b_names[i] + "_ripple"}>{button}</Ripples>)
  }

  closeVariNameModal() {
    this.setState({ variNameModalVisible: false })
  }

  openVariNameModal() {
    this.setState({ variNameModalVisible: true })
  }

  createThisVariation(name, subname = undefined) {
    if (name.length !== 0) {
      /*let vari_index = */this.props.createVari(name, this.state.json_moves, this.props.op_index, subname)
      // this.props.history.push("/openings/" + this.props.op_index)

      // this.props.notify(`${name} ${subname} created!`, "important")
      this.setState({
        variNameModalVisible: false, variationAddedModalVisible: true, variationAddedNames: {
          name: name,
          subname: subname
        }
      })
    }
  }

  onCommentClick() {
    if (this.props.allowCommentEdit) {
      this.setState({ commentModalVisible: true })
    }
  }

  setArrows(arrows) {
    this.setState({ arrows })
  }

  makeCongrats() {
    // this.props.notify("Congrats", "important")
    this.setState({ trainingFinishedModalVisible: true })
  }

}

export default Board
