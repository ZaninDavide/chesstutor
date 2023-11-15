import React, { Component } from "react"
import Chess from "../chessjs-chesstutor/chess.js"

import { cells, cells_rotated, cell_coords, cell_coords_rotated, pieces_names } from "../utilities/pieces_and_coords"
import { get_piece_src, get_board_svg, get_board_rotated_svg, sound_capture, sound_move, sound_error } from "../utilities/file_paths"
import { VARI_TRAINING_MODE, GROUP_TRAINING_MODE, OPENING_TRAINING_MODE, COLOR_TRAINING_MODE, SMART_TRAINING_MODE, FREE_PLAYING_MODE, NEW_VARI_MODE, AGAINST_STOCKFISH_MODE } from "../utilities/constants"
import { move_to_fromto } from "../utilities/san_parsing.js"
import { copy_text_to_clipboard } from "../utilities/copy.js"

import PromotionModal from "../components/PromotionModal"
import CommentModal from "../components/CommentModal"
import HelpModal from "../components/HelpModal"
import HangingMenu from "../components/HangingMenu"
import VariationAddedModal from "../components/VariationAddedModal"
import TrainingFinishedModal from "../components/TrainingFinishedModal"
import LoadVariationsModal from "../components/LoadVariationsModal"
import Translator from "../components/Translator"

import Ripples from "react-ripples"
import BoardData from "../components/BoardData"
import Arrows from "../components/Arrows"
import Stockfish from "../stockfish_uci/stockfish_uci"

import "../styles/Board.css"

class Board extends Component {
  clientX_down = 0
  clientY_down = 0
  left_mouse_down = false
  on_drag = false
  dragged_away = false

  move_audio
  capture_audio
  error_audio

  first_time_rotation = true
  
  engine = new Stockfish(
    this.stockfish_set_eval.bind(this), 
    this.stockfish_set_best.bind(this),
    this.stockfish_set_calculated_depth.bind(this),
    this.setArrows.bind(this),
    this.get_use_lichess_cloud.bind(this)
  )
  constructor(props) {
    super(props)
    
    let starterSmallBoard = this.props.match ? (
      this.props.match.params.board_size ? (
      this.props.match.params.board_size === "small" ? true : false
    ) : false ) : false;

    this.state = {
      game: new Chess(),
      json_moves: [], // moves' history in the correct format (see vari.moves)
      selected_cell: undefined, // undefined or "d4"
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
      smallBoard: starterSmallBoard,
      smart_training_errors_first: null,
      smart_training_errors_counter: 0,
      smart_training_error_made_here: false,
      stockfish: {
        active: false,
        depth: 8,
        show_eval: false,
        show_best: false,
        use_lichess_cloud: true,
        eval: 0,
        best: "",
        calculated_depth: 0,
      },
      book_query_op_index: null,
      book_query_vari_name: null,
      book_query_vari_subname: null,
    }
    /* functions */
    this.newGame = this.newGame.bind(this)
    this.testChess = this.testChess.bind(this)
    this.selectCell = this.selectCell.bind(this)
    this.deselectCells = this.deselectCells.bind(this)
    this.boardClick = this.boardClick.bind(this)
    this.clickCell = this.clickCell.bind(this)
    this.try_undo = this.try_undo.bind(this)
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
    this.makeSoftCongrats = this.makeSoftCongrats.bind(this)
    this.resetBoard = this.resetBoard.bind(this)
    this.onStart = this.onStart.bind(this)
    this.keydown_event = this.keydown_event.bind(this)
    this.stockfish_switch_show_eval = this.stockfish_switch_show_eval.bind(this)
    this.stockfish_switch_show_best = this.stockfish_switch_show_best.bind(this)
    this.stockfish_set_depth = this.stockfish_set_depth.bind(this)
    this.stockfish_switch_use_lichess_cloud = this.stockfish_switch_use_lichess_cloud.bind(this)
    this.try_undo_n_times = this.try_undo_n_times.bind(this);
    this.try_redo_n_times = this.try_redo_n_times.bind(this);
    /* refs */
    this.selectedPiece = React.createRef()
    
    this.move_audio = new Audio(sound_move)
    this.capture_audio = new Audio(sound_capture)
    this.error_audio = new Audio(sound_error)
  }

  // static getDerivedStateFromProps(props) {
  // }

  componentDidMount() {
    if(this.first_time_rotation){
      this.first_time_rotation = false
      this.setState({ rotated: this.props.rotation === "black" ? true : false });
    }
    // called when the component is first created
    this.onStart()
    window.addEventListener("keydown", this.keydown_event)
  }

  componentWillUnmount() {
    this.engine.quit()
    window.removeEventListener("keydown", this.keydown_event)
  }

  /* ---------------------------- COMPONENT ---------------------------- */

  render() {
    let thereIsComment = !(this.props.op_index === undefined || !this.state.json_moves) ? this.props.getComment(this.props.op_index, this.state.json_moves) : false
    return (
      <React.Fragment>
        {/* --------------------------------------- BOARD --------------------------------------- */}

        <div id="boardGrid" key="boardGrid" className={this.state.smallBoard ? "smallBoard" : ""}>
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
            tabs={this.props.tabs}

            op_index={
              this.props.target_vari === undefined || this.props.target_vari.op_index === undefined || this.props.target_vari.op_index === null 
            ? 
              this.props.op_index
            :
              this.props.target_vari.op_index
            }
            json_moves={this.state.json_moves}
            moves_forward={this.state.moves_forward}
            ops={this.props.ops}
            match={this.props.match}
            vari_index={choose(this.props.vari_index, this.props.target_vari ? this.props.target_vari.vari_index : null)}
            vari_name={choose(this.props.vari_name, this.props.target_vari ? this.props.target_vari.vari_name : null)}
            vari_subname={choose(this.props.vari_subname, this.props.target_vari ? this.props.target_vari.vari_subname : null)}
            vari_op_name={
              this.props.ops && ((this.props.op_index !== undefined && this.props.op_index !== null) || ((this.props.target_vari ? this.props.target_vari.op_index : undefined) !== undefined && this.props.target_vari.op_index !== null)) ? 
              (this.props.ops[choose(this.props.op_index, this.props.target_vari ? this.props.target_vari.op_index : null)] ? this.props.ops[choose(this.props.op_index, this.props.target_vari ? this.props.target_vari.op_index : null)].op_name : null) : null              
            }
            
            thereIsComment={thereIsComment}
            onCommentClick={this.onCommentClick}
            getComment={this.props.getComment}
            getDrawBoardPDF={this.props.getDrawBoardPDF}
            board_mode={this.props.mode}
            get_correct_moves_data_book={this.props.get_correct_moves_data_book}
            book_move={move => this.make_move(move)}
            get_fen={this.state.game.fen}
            try_undo_n_times={this.try_undo_n_times}
            try_redo_n_times={this.try_redo_n_times}

            stockfish={this.state.stockfish}
            stockfish_switch_show_best={this.stockfish_switch_show_best}
            stockfish_switch_show_eval={this.stockfish_switch_show_eval}
            stockfish_set_depth={this.stockfish_set_depth}
            stockfish_switch_use_lichess_cloud={this.stockfish_switch_use_lichess_cloud}

            book_query_op_index={this.state.book_query_op_index}
            book_query_vari_name={this.state.book_query_vari_name}
            book_query_vari_subname={this.state.book_query_vari_subname}

            set_book_query_op_index={index => this.setState({book_query_op_index: index})}
            set_book_query_vari_name={name => this.setState({book_query_vari_name: name})}
            set_book_query_vari_subname={subname => this.setState({book_query_vari_subname: subname})}
            set_book_query={(index, name, subname) => this.setState({
              book_query_op_index: index,
              book_query_vari_name: name,
              book_query_vari_subname: subname
            })}

            rotated={this.state.rotated}
            settings={this.props.settings}
            stats={this.props.stats}
            today_str={this.props.today_str}
          />
        </div>


        {/* --------------------------------------- MODALS --------------------------------------- */}

        {/* CHOOSE PROMOTION PIECE MODAL */}
        <PromotionModal
          color={this.state.game.turn()}
          visible={this.state.promotionModalVisible}
          close={() => this.setState({ promotionModalVisible: false })}
          promotionPromiseRes={this.state.promotionPromiseRes}
        />

        {/* COMMENT MODAL */}
        <CommentModal
          visible={this.state.commentModalVisible}
          close={() => this.setState({ commentModalVisible: false })}
          editComment={this.props.editComment}
          setDrawBoardPDF={this.props.setDrawBoardPDF}
          getDrawBoardPDF={this.props.getDrawBoardPDF}
          getComment={this.props.getComment}
          op_index={this.props.op_index}
          json_moves={this.state.json_moves}
        />

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
        <HangingMenu 
          visible={this.state.boardMenuVisible} 
          close={() => this.setState({ boardMenuVisible: false })}
          title={<Translator text={"Board"}/>}
        >
          {/* COPY PNG TO CLIPBOARD */}
          {this.props.moreMenuButtons.indexOf("copy_png") !== -1 ?
            <button className="simpleButton hMenuButton" onClick={() => {
              copy_text_to_clipboard(this.state.game.pgn(), () => {
                this.props.notify("PGN copied successfully", "normal");
              }, () => {
                this.props.notify("PGN could not be copied", "error");
              });
              this.setState({ boardMenuVisible: false });
            }}>
              <div className="hMenuButtonContent">
                <div className="hMenuButtonIcon">file_copy</div>
                <div className="hMenuButtonLabel"><Translator text="Copy PNG"/></div>
              </div>
            </button> : null
          }
          {/* COPY FEN TO CLIPBOARD */}
          {this.props.moreMenuButtons.indexOf("copy_fen") !== -1 ?
            <button className="simpleButton hMenuButton" onClick={() => {
              copy_text_to_clipboard(this.state.game.fen(), () => {
                this.props.notify("FEN copied successfully", "normal");
              }, () => {
                this.props.notify("FEN could not be copied", "error");
              });
              this.setState({ boardMenuVisible: false });
            }}>
              <div className="hMenuButtonContent">
                <div className="hMenuButtonIcon">content_copy</div>
                <div className="hMenuButtonLabel"><Translator text="Copy FEN"/></div>
              </div>
            </button> : null
          }
          {/* BOARD SIZE */}
          {this.props.moreMenuButtons.indexOf("smallBoard") !== -1 ?
            <button className="simpleButton hMenuButton" onClick={() => {
              this.setState({ boardMenuVisible: false })
              this.setState(old => {return{smallBoard: !old.smallBoard}})
            }}>
              <div className="hMenuButtonContent">
                <div className="hMenuButtonIcon">{this.state.smallBoard ? "open_in_full" : "close_fullscreen"}</div>
                <div className="hMenuButtonLabel"><Translator text={this.state.smallBoard ? "Large board" : "Small board"}/></div>
              </div>
            </button> : null
          }
          {/* ROTATE BOARD */}
          {this.props.moreMenuButtons.indexOf("flip") !== -1 ?
            <button className="simpleButton hMenuButton" onClick={() => {
              this.setState(old => {return { boardMenuVisible: false, rotated: !old.rotated } })
            }}>
              <div className="hMenuButtonContent">
                <div className="hMenuButtonIcon">rotate_right</div>
                <div className="hMenuButtonLabel"><Translator text={"Flip"}/></div>
              </div>
            </button> : null
          }
          {/* ANALYSIS BUTTON */}
          {this.props.moreMenuButtons.indexOf("Analyze") !== -1 ?
            <button className="simpleButton hMenuButton" onClick={() => {
            this.setState({ boardMenuVisible: false })
            const moves = JSON.stringify(this.state.json_moves)
            // /analysis/:color/:board_size/:tab/:moves
            let board_size = this.state.smallBoard ? "small" : "normal"
            this.props.history.push("/analysis/" + this.props.rotation + "/" + board_size + "/moves_list/" + moves)
          }}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">biotech</div>
              <div className="hMenuButtonLabel"><Translator text={"Analyze position"}/></div>
            </div>
          </button> : null
          }
          {/* LOAD VARIATIONS BUTTON */}
          {this.props.moreMenuButtons.indexOf("load_variations") !== -1 ?
            <button className="simpleButton hMenuButton" onClick={() => {
              this.setState({ boardMenuVisible: false, loadVariationsModalVisible: true })
          }}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">upload</div>
              <div className="hMenuButtonLabel"><Translator text="Load lines from PGN"/></div>
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
          done={this.resetBoard}
          json_moves={this.state.json_moves}
          trainColor={this.props.trainColor}
          trainGroup={this.props.trainGroup}
          vari_name={this.props.vari_name}
          vari_subname={this.props.vari_subname}
          get_compatible_variations={this.props.get_compatible_variations}
        />

        {/* LOAD VARIATIONS MODAL */}
        <LoadVariationsModal 
          visible={this.state.loadVariationsModalVisible}
          close={() => this.setState({ loadVariationsModalVisible: false })}
          notify={this.props.notify}
          addVariations={new_varis => {
            this.props.addMultipleVaris(this.props.op_index, this.props.vari_name, new_varis);
            this.props.history.push("/openings/" + this.props.op_index)
          }}
        />
      </React.Fragment>
    )
  }

  onStart() {
    if (this.props.startMoves) {
      /*const fen = this.props.startFen.split("_").join("/")*/
      /*const turn = this.state.game.load(fen)*/

      let moves = JSON.parse(this.props.startMoves);
      moves.forEach(m => this.state.game.move(m.san));
      this.engine.set_moves(moves);
      this.setState({ json_moves: moves });
      this.forceUpdate()
    }

    // pc make first move if the player plays as black
    if (this.props.playColor === "black") {
      this.pc_move([])
    }
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

        // TODO: ERROR: THIS CANNOT BE DONE
        // we are calling setState from within setState
        this.engine.move(move.from + move.to + (move.promotion || ""))
        if(this.state.stockfish.show_best || this.state.stockfish.show_eval) {
          this.engine.go()
        }

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
            smart_training_error_made_here: false,
          }
        }
      }, () => {
        // scroll the tree to the bottom after the state got updated
        let tree = document.getElementById("boardDataTreeSlide");
        if (tree) tree.scrollTop = tree.scrollHeight;
        let tableMoves = document.getElementById("boardDataMovesTableSlide");
        if (tableMoves) tableMoves.scrollTop = tableMoves.scrollHeight;
      })
    })

  }

  async try_move(move_data) {
    // move data is an object: {from: "d2", to: "d5", promotion: undefined}
    // as default move_data.from = this.state.selected_cell

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

      const mode = this.props.mode

      let is_this_move_allowed = true
      let is_this_move_smart_alternative = false
      if (mode === OPENING_TRAINING_MODE || mode === VARI_TRAINING_MODE) {
        // OPENING_TRAINING_MODE & VARI_TRAINING_MODE
        if(!this.props.is_move_allowed) { console.log("Board: try_move() error. is_move_allowed missing"); return false } 
        // TODO - should check if it is not the turn of the computer
        // if the function exists try and see if this move is allowed(i don't mean illegal, if the move cannot be done for other reasons)
        // if var_index exists it looks only into it
        is_this_move_allowed = this.props.is_move_allowed(this.props.op_index, this.state.json_moves, move_data, this.props.vari_index)
      }
      else if (mode === COLOR_TRAINING_MODE) {
        // COLOR_TRAINING_MODE
        if(!this.props.is_move_allowed_color) { console.log("Board: try_move() error. is_move_allowed_color missing"); return false } 
        is_this_move_allowed = this.props.is_move_allowed_color(this.props.trainColor, this.state.json_moves, move_data)
      }
      else if (mode === GROUP_TRAINING_MODE) {
        // GROUP_TRAINING_MODE
        if(!this.props.is_move_allowed_group) { console.log("Board: try_move() error. is_move_allowed_group missing"); return false } 
        is_this_move_allowed = this.props.is_move_allowed_group(this.props.op_index, this.state.json_moves, move_data, this.props.trainGroup)
      }
      else if (mode === SMART_TRAINING_MODE) {
        // SMART_TRAINING_MODE
        if(!this.props.is_move_allowed) { console.log("Board: try_move() error. is_move_allowed missing"); return false } 
        is_this_move_allowed = this.props.is_move_allowed(this.props.target_vari.op_index, this.state.json_moves, move_data, this.props.target_vari.vari_index)
      
        if(!is_this_move_allowed){
          // is this an alternative move but not the one we want you to train on?
          if(!this.props.is_move_allowed_color) { console.log("Board: try_move() error. is_move_allowed_color missing"); return false } 
          is_this_move_smart_alternative = this.props.is_move_allowed_color(this.props.target_vari.op_color, this.state.json_moves, move_data)
        }
      }


      if (is_this_move_allowed) { // allowed as default
        // MAKE THE MOVE
        let moves_list_after = await this.make_move(move_data)

        if (this.props.playColor !== "both") {
          // Let the computer figure out what to move next 
          this.pc_move(moves_list_after, this.props.vari_index)
        }

      } else if (is_this_move_smart_alternative) {
        // TODO: play okay sound
        this.props.notify("It's okay. Find another good move.", "important")
        return false
      } else {
        this.play_error_sound()
        if(mode === SMART_TRAINING_MODE && !this.state.smart_training_error_made_here) 
          this.setState(old => ({
            smart_training_errors_first: old.smart_training_errors_first === null ? this.state.json_moves.length + 1 : old.smart_training_errors_first,
            smart_training_errors_counter: old.smart_training_errors_counter + 1, 
            smart_training_error_made_here: true
          }))
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
      // ask for stockfish evaluation if needed
      this.engine.undo()
      if(this.state.stockfish.show_best || this.state.stockfish.show_eval) {
        this.engine.go()
      }
      // pop the move out of the list of all moves of the game 
      this.setState(old => {
        // add this move to moves_forward
        // remove it from json_moves
        let moves_list = old.json_moves
        moves_list.pop()

        return {
          json_moves: moves_list,
          moves_forward: [move, ...old.moves_forward],
        }
      })
    } else {
      console.log("Cannot undo before any move is done")
    }
  }

  try_undo_n_times(n) {
    // you can't go back more moves than you played 
    if (this.state.json_moves.length < n) n = this.state.json_moves.length
    if (n <= 0) return;

    this.setState(old => {

      let moves = []
      let moves_list = old.json_moves

      for (let index = 0; index < n; index++) {
        // if you play with black only you can't go back to the initial position
        if (moves_list.length === 1 && this.props.playColor === "black") break;
        // undo the move
        moves.push(this.state.game.undo())
        moves_list.pop()
        this.engine.undo()
      }

      // if you play with white only you can't stop after a white move
      if (moves_list.length % 2 === 1 && this.props.playColor === "white") {
        moves.push(this.state.game.undo())
        moves_list.pop()
        this.engine.undo()
      }

      // if you play with black only you can't stop after a black move
      if (moves_list.length % 2 === 0 && this.props.playColor === "black") {
        moves.push(this.state.game.undo())
        moves_list.pop()
        this.engine.undo()
      }

      moves.reverse()

      return {
        json_moves: moves_list,
        moves_forward: [...moves, ...old.moves_forward],
        arrows: []
      }

    }, () => {
      this.engine.go()
    })
  }

  try_redo_n_times(n) {
    // you can go forward at maximum moves_forward.length times
    if (this.state.moves_forward.length < n) n = this.state.json_moves.length
    // you can't go forward if the are no more moves 
    if (n <= 0) return;

    this.setState(old => {
      let played_moves = [] // list of moves this function has played
      let new_moves_forward = old.moves_forward // moves_forward still remaining

      for (let index = 0; index < n; index++) {
        // redo the move
        let m = this.state.game.move(new_moves_forward.shift())
        if(m) {
          played_moves.push(m)
          this.engine.move(move_to_fromto(m))
        }else{
          return;
        }
      }

      return {
        json_moves: [...old.json_moves, ...played_moves],
        moves_forward: new_moves_forward,
        arrows: []
      }
    }, () => {
      this.engine.go()
    })
  }

  pc_move(json_moves, vari_index = undefined) {
    const mode = this.props.mode

    // SMART_TRAINING_MODE cannot be inside congrats mode
    const is_congrats_mode = 
      mode === OPENING_TRAINING_MODE ||
      mode === VARI_TRAINING_MODE ||
      mode === GROUP_TRAINING_MODE;

    // SMART_TRAINING_MODE cannot be inside soft congrats mode
    const is_soft_congrats_mode = mode === COLOR_TRAINING_MODE;

    const is_depth_goal_mode = mode === SMART_TRAINING_MODE;
    const depth_goal_reached = json_moves.length >= this.props.settings.depth_goal;

    let move_data = null

    if (mode === OPENING_TRAINING_MODE || mode === VARI_TRAINING_MODE) {
      // OPENING_TRAINING_MODE & VARI_TRAINING_MODE
      if(this.props.get_pc_move_data === undefined) { console.log("Board: pc_move() error. get_pc_move_data missing"); return false }
      move_data = this.props.get_pc_move_data(this.props.op_index, json_moves, vari_index)
      
    } else if (mode === COLOR_TRAINING_MODE) {
      // COLOR_TRAINING_MODE
      if(this.props.trainColor === undefined) { console.log("Board: pc_move() error. trainColor missing"); return false }
      if(this.props.get_pc_move_data_color === undefined) { console.log("Board: pc_move() error. get_pc_move_data_color missing"); return false }
      move_data = this.props.get_pc_move_data_color(this.props.trainColor, json_moves)
    
    } else if (mode === GROUP_TRAINING_MODE) { 
      // GROUP_TRAINING_MODE
      if(this.props.trainGroup === undefined) { console.log("Board: pc_move() error. trainGroup missing"); return false }
      if(this.props.get_pc_move_data_group === undefined) { console.log("Board: pc_move() error. get_pc_move_data_group missing"); return false }
      move_data = this.props.get_pc_move_data_group(this.props.op_index, json_moves, this.props.trainGroup)
    
    } else if (mode === SMART_TRAINING_MODE) { 
      // SMART_TRAINING_MODE
      if(this.props.target_vari.op_index === undefined) { console.log("Board: pc_move() error. target_vari.op_index missing"); return false }
      if(this.props.target_vari.vari_index === undefined) { console.log("Board: pc_move() error. target_vari.vari_index missing"); return false }
      if(this.props.get_pc_move_data === undefined) { console.log("Board: pc_move() error. get_pc_move_data missing"); return false }
      move_data = this.props.get_pc_move_data(this.props.target_vari.op_index, json_moves, this.props.target_vari.vari_index)
    }

    if (move_data !== null && !(depth_goal_reached && is_depth_goal_mode)) {
      // WAIT AND PLAY THE COMPUTER MOVE, THEN CHECK IF THE TRAINING HAS FINISHED
      setTimeout(async () => {
        // the pc makes his move
        let pc_move_data = await await this.make_move(move_data)

        // now that pc has moved is the training finished?
        // it's repetitive because the same move can occur multiple times
        let correct_moves_repetitive = []

        if (mode === OPENING_TRAINING_MODE || mode === VARI_TRAINING_MODE) {
          // OPENING_TRAINING_MODE & VARI_TRAINING_MODE
          if(this.props.get_correct_moves_data === undefined) { console.log("Board: pc_move() error. get_correct_moves_data missing"); return false }
          correct_moves_repetitive = this.props.get_correct_moves_data(this.props.op_index, pc_move_data, this.props.vari_index)
          
        } else if (mode === COLOR_TRAINING_MODE) {
          // COLOR_TRAINING_MODE
          if(this.props.trainColor === undefined) { console.log("Board: pc_move() error. trainColor missing"); return false }
          if(this.props.get_correct_moves_data_color === undefined) { console.log("Board: pc_move() error. get_correct_moves_data_color missing"); return false }
          correct_moves_repetitive = this.props.get_correct_moves_data_color(this.props.trainColor, pc_move_data)
        
        } else if (mode === GROUP_TRAINING_MODE) { 
          // GROUP_TRAINING_MODE
          if(this.props.trainGroup === undefined) { console.log("Board: pc_move() error. trainGroup missing"); return false }
          if(this.props.get_correct_moves_data_group === undefined) { console.log("Board: pc_move() error. get_correct_moves_data_group missing"); return false }
          correct_moves_repetitive = this.props.get_correct_moves_data_group(this.props.op_index, pc_move_data, this.props.trainGroup)

        } else if (mode === SMART_TRAINING_MODE) { 
          // SMART_TRAINING_MODE
          if(this.props.get_correct_moves_data === undefined) { console.log("Board: pc_move() error. get_correct_moves_data missing"); return false }
          correct_moves_repetitive = this.props.get_correct_moves_data(this.props.target_vari.op_index, pc_move_data, this.props.target_vari.vari_index)
        }

        // training finished
        if(correct_moves_repetitive.length === 0){
          if (is_congrats_mode) {
            this.makeCongrats()
          } else if(is_soft_congrats_mode) {
            this.makeSoftCongrats()
          }
          if(mode === COLOR_TRAINING_MODE){
            this.resetBoard()
          }
          if (mode === SMART_TRAINING_MODE){
            this.props.onSmartTrainingVariFinished(
              this.props.target_vari.op_index,
              this.props.target_vari.vari_index,
              this.state.smart_training_errors_first, 
              this.resetBoard
            )
          }
        }
        

      }, this.props.settings.wait_time)
    }else{
      // training finished
      if (is_congrats_mode) {
        this.makeCongrats()
      } else if (is_soft_congrats_mode) {
        this.makeSoftCongrats()
      }
      if(mode === COLOR_TRAINING_MODE){
        // we wait otherwise we have no time to see the piece moving
        setTimeout(this.resetBoard, this.props.settings.wait_time);
      }
      if (mode === SMART_TRAINING_MODE){
        const last_depth = this.state.smart_training_errors_first !== 0 ? this.state.smart_training_errors_first : json_moves.length;
        this.props.onSmartTrainingVariFinished(
          this.props.target_vari.op_index,
          this.props.target_vari.vari_index,
          last_depth, 
          (color) => {
            this.resetBoard();
            this.setState({rotated: color === "black"});
          }
        )
      }
    }
  }

  /* ---------------------------- STOCKFISH UI ---------------------------- */

  stockfish_switch_show_eval() {
    this.setState(old => {
      return {stockfish: {...old.stockfish, show_eval: !old.stockfish.show_eval}
    }}, () => {
      if(this.state.stockfish.show_eval) this.engine.go()
    })
  }

  stockfish_switch_show_best() {
    this.setState(old => {
      if(old.stockfish.show_best) {
        return {stockfish: {...old.stockfish, show_best: !old.stockfish.show_best}, arrows: []}
      }else{
        return {stockfish: {...old.stockfish, show_best: !old.stockfish.show_best}}
      }
    }, () => {
      if(this.state.stockfish.show_best) this.engine.go()
    })
  }

  stockfish_switch_use_lichess_cloud() {
    this.setState(old => {
      return {stockfish: {...old.stockfish, use_lichess_cloud: !old.stockfish.use_lichess_cloud}}
    }, () => {
      if(this.state.stockfish.show_eval || this.state.stockfish.show_best){
        this.engine.go()
      }
    })
  }

  stockfish_set_eval(value) {
    this.setState(old => {return {stockfish: {...old.stockfish, eval: value}}})
  }

  stockfish_set_best(value) {
    this.setState(old => {return {stockfish: {...old.stockfish, best: value}}})
  }

  stockfish_set_calculated_depth(value) {
    this.setState(old => {return {stockfish: {...old.stockfish, calculated_depth: value}}})
  }

  stockfish_set_depth(value) {
    this.setState(old => {return {stockfish: {...old.stockfish, depth: value}}})
    const old_depth = this.engine.depth
    this.engine.set_depth(value)
    if(old_depth < value && (this.state.stockfish.show_best || this.state.stockfish.show_eval)) this.engine.go()
  }

  get_use_lichess_cloud() {
    return this.state.stockfish.use_lichess_cloud
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
      className={is_selected ? "pieceSVG noAnimationPiece" : "pieceSVG staticPiece"} /* && this.on_drag  */
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
    if (over === undefined || sel === undefined || !this.dragged_away) return <div key="touchCircle" />

    let coor = this.cellCoordinates(over)
    coor.x = coor.x / Math.sqrt(2) - 100 / 8
    coor.y = coor.y / Math.sqrt(2) - 100 / 8

    return <div style={{ transform: `translate(calc(${coor.x}% - 2px), calc(${coor.y}% - 4px))` }} key="touchCircle" id="touchCircle" />
    // return <div style={{ transform: `translate(${coor.x/1.5 - 17.25}%, ${coor.y/1.5 - 19.75}%)` }} key="touchCircle" id="touchCircle" />

    /*if(!this.state.selected_cell || !this.on_drag) return <div key="touchCircle" ref={this.touchCircleRef} />
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
    this.clientX_down = clientX
    this.clientY_down = clientY
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
      this.on_drag = selection_res ? true : false
      this.left_mouse_down = true
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
    }
    this.clientX_down = 0
    this.clientY_down = 0
    this.on_drag = false
    this.left_mouse_down = false
    this.dragged_away = false
    requestAnimationFrame(() => this.forceUpdate())
  }

  boardDrag(e) {
    if (this.state.selected_cell && this.selectedPiece.current && this.left_mouse_down && this.on_drag) {
      let clientX = e.clientX
      let clientY = e.clientY

      if (e.type === "touchmove") {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      //move piece
      let deltaX = clientX - this.clientX_down
      let deltaY = clientY - this.clientY_down
      this.dragged_away = deltaX !== 0 || deltaY !== 0 || this.dragged_away

      if(this.selectedPiece.current.style.left !== deltaX + "px") this.selectedPiece.current.style.left = deltaX + "px"
      if(this.selectedPiece.current.style.top !== deltaY + "px") this.selectedPiece.current.style.top = deltaY + "px"
        // find the coordinates of the mouse
        const coor = { x: clientX - this.refs.bContainer.offsetLeft, y: clientY - this.refs.bContainer.offsetTop }
        coor.x = Math.floor((coor.x / this.refs.board.width) * 8) * 100
        coor.y = Math.floor((coor.y / this.refs.board.width) * 8) * 100
  
        // inside the board?
        if (coor.x <= 700 && coor.y <= 700) {
          // try to move there
          requestAnimationFrame(() => {
            const cell = this.cellFromCoor(coor)
            this.setState({ mouse_over_cell: cell })
          })
        }
    }
  }

  async play_move_sound(move) {
    // move is what the game.move() function returns
    if (move) {
      if (move.flags.indexOf("c") !== -1 || move.flags.indexOf("e") !== -1) {
        this.capture_audio.volume = this.props.settings.volume
        this.capture_audio.currentTime = 0
        this.capture_audio.play()
      } else {
        this.move_audio.volume = this.props.settings.volume
        this.move_audio.currentTime = 0
        this.move_audio.play()
      }
    }
  }

  async play_error_sound() {
    this.move_audio.volume = this.props.settings.volume
    this.error_audio.currentTime = 0
    this.error_audio.play()
  }


  /* ---------------------------- UI ELEMENTS ---------------------------- */

  next_button_click() {
    requestAnimationFrame(() => {
      if (this.props.playColor === "none" || this.is_my_turn()) {
        let move_data = this.props.get_vari_next_move_data(this.props.op_index, this.props.vari_index, this.state.json_moves)
        if (move_data !== null) {
          this.make_move(move_data)
        }
      }
    })
  }

  forward_next_button_click() {
    requestAnimationFrame(() => {
      if (this.state.moves_forward.length > 0) {
        let move_data = this.state.moves_forward[0]
        if (move_data !== null) {
          this.make_move(move_data)
        }
      }
    })
  }

  back_button_click() {
    requestAnimationFrame(() => {
      const before_turn = this.state.game.turn()
      this.try_undo()
      if (this.is_my_turn(before_turn, false)) { // undo twice
        this.try_undo()
      }
    })
  }

  help_button_click(can_auto_move = false) {
    const mode = this.props.mode
    requestAnimationFrame(async () => {
      if (!this.is_my_turn()) return false
      // get moves data [{from: "d2", to: "d4", san: "d4"}, ...]

      let correct_moves_repetitive = []

      if (mode === OPENING_TRAINING_MODE || mode === VARI_TRAINING_MODE) {
        // OPENING_TRAINING_MODE & VARI_TRAINING_MODE
        if(this.props.get_correct_moves_data === undefined) { console.log("Board: help_button_click() error. get_correct_moves_data missing"); return false }
        correct_moves_repetitive = this.props.get_correct_moves_data(this.props.op_index, this.state.json_moves, this.props.vari_index)
        
      } else if (mode === COLOR_TRAINING_MODE) {
        // COLOR_TRAINING_MODE
        if(this.props.trainColor === undefined) { console.log("Board: help_button_click() error. trainColor missing"); return false }
        if(this.props.get_correct_moves_data_color === undefined) { console.log("Board: help_button_click() error. get_correct_moves_data_color missing"); return false }
        correct_moves_repetitive = this.props.get_correct_moves_data_color(this.props.trainColor, this.state.json_moves)
      
      } else if (mode === GROUP_TRAINING_MODE) { 
        // GROUP_TRAINING_MODE
        if(this.props.trainGroup === undefined) { console.log("Board: help_button_click() error. trainGroup missing"); return false }
        if(this.props.get_correct_moves_data_group === undefined) { console.log("Board: help_button_click() error. get_correct_moves_data_group missing"); return false }
        correct_moves_repetitive = this.props.get_correct_moves_data_group(this.props.op_index, this.state.json_moves, this.props.trainGroup)
      
      } else if (mode === SMART_TRAINING_MODE) {
        // OPENING_TRAINING_MODE & VARI_TRAINING_MODE
        if(this.props.get_correct_moves_data === undefined) { console.log("Board: help_button_click() error. get_correct_moves_data missing"); return false }
        correct_moves_repetitive = this.props.get_correct_moves_data(this.props.target_vari.op_index, this.state.json_moves, this.props.target_vari.vari_index)

      } else if (mode === NEW_VARI_MODE) {
        // NEW_VARI_MODE
        if(this.props.get_correct_moves_data_book === undefined) { console.log("Board: help_button_click() error. get_correct_moves_data_book missing"); return false }
        correct_moves_repetitive = this.props.get_correct_moves_data_book(this.state.json_moves, this.state.book_query_op_index, this.state.book_query_vari_name, this.state.book_query_vari_subname)
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
          this.pc_move(this.props.op_index, moves_list_after, this.props.vari_index)
        }
      }
    })
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
            onClick={() => {
              const allowed_subnames = this.props.getOpFreeSubnames(1, this.props.op_index, this.props.vari_name, false)
              this.createThisVariation(this.props.vari_name, allowed_subnames[0])
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
              this.props.set_in_training(true, (newPlayColor) => {
                if (
                  (newPlayColor === "black" && this.state.json_moves.length % 2 === 0) ||
                  (newPlayColor === "white" && this.state.json_moves.length % 2 === 1)
                ) { // if it's the turn of the pc to move
                  this.pc_move(this.state.json_moves, this.props.vari_index)
                }
              })
            }}
          >school</button>
        )
        b_names.push("trainThisButton")
      }
    }
    return b_objects.map((button, i) => <Ripples className="simpleButton boardButton" key={b_names[i] + "_ripple"}>{button}</Ripples>)
  }

  createThisVariation(name, subname = undefined) {
    if (name.length !== 0) {
      /*let vari_index = */this.props.createVari(name, this.state.json_moves, this.props.op_index, subname)
      // this.props.history.push("/openings/" + this.props.op_index)

      // this.props.notify(`${name} ${subname} created!`, "important")
      this.setState({
        variationAddedModalVisible: true, variationAddedNames: {
          name: name,
          subname: subname
        }
      })
    }
  }

  onCommentClick() {
    requestAnimationFrame(() => {
      if (this.props.allowCommentEdit) {
        this.setState({ commentModalVisible: true })
      }
    })
  }

  setArrows(arrows, check_show_best = false) {
    if(!check_show_best || this.state.stockfish.show_best){
      requestAnimationFrame(() => this.setState({ arrows }))
    }
  }

  makeCongrats() {
    // this.props.notify("Congrats", "important")
    this.setState({ trainingFinishedModalVisible: true })
  }
  makeSoftCongrats() {
    // play congrats sound
    this.props.play_training_finished_sound();
  }

  resetBoard() {
    this.setState(old => {return { 
      json_moves: [], 
      json_moves_length: 0, 
      moves_forward: old.json_moves, 
      game: new Chess(), 
      selected_cell: undefined, 
      arrows: [],
      smart_training_errors_first: null,
      smart_training_errors_counter: 0,
      smart_training_error_made_here: false,
    }}, this.onStart)
  }

  keydown_event(e) {
    if(e.keyCode === 37 && this.props.buttons.indexOf("back") !== -1){ // left
      this.back_button_click()
    }else if(e.keyCode === 39){ // right
      if(
        this.props.buttons.indexOf("single_next") !== -1 &&
        (this.is_my_turn() || this.props.playColor === "none") && this.props.get_vari_next_move_data(this.props.op_index, this.props.vari_index, this.state.json_moves)
      ){ this.next_button_click() }
      else if(
        this.props.buttons.indexOf("forward_next") !== -1 && 
        this.state.moves_forward.length > 0
      ) { this.forward_next_button_click() }
      else if(
        this.props.buttons.indexOf("multi_next") !== -1 &&
        this.is_my_turn()
      ) { this.help_button_click(true) }
      else if(
        this.props.buttons.indexOf("help") !== -1 &&
        this.is_my_turn()
      ) { this.help_button_click(false) }
    }
  }
}

function choose() {
  for(let i = 0; i < arguments.length; i++) {
    if(arguments[i] !== null && arguments[i] !== undefined && !isNaN(arguments[i])) {
      return arguments[i];
    }
  }
}

export default Board