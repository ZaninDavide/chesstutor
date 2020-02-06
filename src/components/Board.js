import React, { Component } from "react"
//import Chess from "chess.js"
import Chess from "../chessjs-chesstutor/chess.js"

// import boardSVG from "../files/chessboard.svg"
import darkBoardSVG from "../files/chessboard_dark.svg"
import whiteKingSVG from "../files/white_king.svg"
import whiteQueenSVG from "../files/white_queen.svg"
import whiteRookSVG from "../files/white_rook.svg"
import whiteKnightSVG from "../files/white_knight.svg"
import whitePawnSVG from "../files/white_pawn.svg"
import whiteBishopSVG from "../files/white_bishop.svg"
import blackKingSVG from "../files/black_king.svg"
import blackQueenSVG from "../files/black_queen.svg"
import blackRookSVG from "../files/black_rook.svg"
import blackKnightSVG from "../files/black_knight.svg"
import blackPawnSVG from "../files/black_pawn.svg"
import blackBishopSVG from "../files/black_bishop.svg"
// import selectionSVG from "../files/selection.svg"

import sound_capture from "../files/sound_capture.mp3"
import sound_move from "../files/sound_move.mp3"
import sound_error from "../files/sound_error.mp3"

import Modal from "../components/Modal"
import Translator from "../components/Translator"
import PromotionModal from "../components/PromotionModal"
import CommentModal from "../components/CommentModal"

const cells = {
  "1": "700",
  "2": "600",
  "3": "500",
  "4": "400",
  "5": "300",
  "6": "200",
  "7": "100",
  "8": "0",
  h: "700",
  g: "600",
  f: "500",
  e: "400",
  d: "300",
  c: "200",
  b: "100",
  a: "0"
}

const cellsRotated = {
  "1": "0",
  "2": "100",
  "3": "200",
  "4": "300",
  "5": "400",
  "6": "500",
  "7": "600",
  "8": "700",
  h: "0",
  g: "100",
  f: "200",
  e: "300",
  d: "400",
  c: "500",
  b: "600",
  a: "700"
}

const cellCoords = {
  "700y": "1",
  "600y": "2",
  "500y": "3",
  "400y": "4",
  "300y": "5",
  "200y": "6",
  "100y": "7",
  "0y": "8",
  "700x": "h",
  "600x": "g",
  "500x": "f",
  "400x": "e",
  "300x": "d",
  "200x": "c",
  "100x": "b",
  "0x": "a"
}

const cellCoordsRotated = {
  "0y": "1",
  "100y": "2",
  "200y": "3",
  "300y": "4",
  "400y": "5",
  "500y": "6",
  "600y": "7",
  "700y": "8",
  "0x": "h",
  "100x": "g",
  "200x": "f",
  "300x": "e",
  "400x": "d",
  "500x": "c",
  "600x": "b",
  "700x": "a"
}

const piecesName = {
  K: "white_king",
  Q: "white_queen",
  R: "white_rook",
  N: "white_knight",
  B: "white_bishop",
  P: "white_pawn",
  k: "black_king",
  q: "black_queen",
  r: "black_rook",
  n: "black_knight",
  b: "black_bishop",
  p: "black_pawn"
}

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
    this.onBoardDataClick = this.onBoardDataClick.bind(this)
    this.next_button_click = this.next_button_click.bind(this)
    /* refs */
    this.selectedPiece = React.createRef()

    move_audio = new Audio(sound_move)
    capture_audio = new Audio(sound_capture)
    error_audio = new Audio(sound_error)
  }

  /* ---------------------------- COMPONENT ---------------------------- */

  render() {
    // console.log("render")
    return (
      <React.Fragment>
        <div id="boardGrid">
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
            <img id="boardSVG" src={darkBoardSVG} alt={"Board file missing"} ref="board" key="board" draggable={false} />
          </div>
          <div id="boardUI">
            {this.boardButtons()}
          </div>
          <div id="boardData" onClick={this.onBoardDataClick}>{ /* TODO - DO NOT OPEN IN TRAINING */}
            Comments: {this.comment()}
          </div>
        </div>
        {/* CREATE NEW VARIATION MODAL */}
        <Modal 
          visible={this.state.variNameModalVisible} 
          close={this.closeVariNameModal} 
          onDoneClick={this.createThisVariation} 
          disabledDoneButton={this.state.new_vari_name.length === 0}
        >
          <Translator text={"New variation name"} />:
          <input type="text" 
            className="textBox"
            value={this.state.new_vari_name} 
            onChange={e => this.setState({new_vari_name: e.target.value})}
            onKeyPress={e => {
              if (e.which === 13 || e.keyCode === 13) {
                this.createThisVariation()
              }
            }}
          />
        </Modal>
        {/* CHOOSE PROMOTION PIECE MODAL */}
        <PromotionModal 
          color={this.state.game.turn()}
          visible={this.state.promotionModalVisible} 
          close={() => this.setState({promotionModalVisible: false})}
          promotionPromiseRes={this.state.promotionPromiseRes}
        />
        {this.state.commentModalVisible ? <CommentModal
          visible={this.state.commentModalVisible} 
          close={() => this.setState({commentModalVisible: false})}
          editComment={this.props.editComment}
          getComment={this.props.getComment}
          op_index={this.props.op_index}
          json_moves={this.state.json_moves}
        /> : null}
      </React.Fragment>
    )
  }

  componentDidMount() {
    // called when the component is first created
    // this.testChess() // test
    
    // pc make first move if the player playes as black
    if(this.props.playColor === "black"){
      this.pc_move(this.props.op_index, [])
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

  is_move_legal(move_data){
    // as default move_data.from = this.state.selectedCell
    if(move_data.from === undefined){
      if(this.state.selected_cell === undefined){return false}
      move_data.from = this.state.selected_cell
    }
    // is it legal?
    let legal_moves = this.state.game.moves({ square: move_data.from, verbose: true }).map(cur => cur.to)
    return legal_moves.includes(move_data.to)
  }

  async make_move(move_data){
    let move = this.state.game.move(move_data)

    this.play_move_sound(move)

    return new Promise(res => {
      this.setState(old => {
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
        return {
          json_moves: moves_list
        }
      })
    })

  }

  async try_move(move_data) {
    // move data is an object: {from: "d2", to: "d5", promotion: undefined}
    // as default move_data.from = this.state.selectedCell

    if(move_data.from === undefined){
      if(this.state.selected_cell === undefined){return false}
      move_data.from = this.state.selected_cell
    }

    if(this.is_move_legal(move_data)){
      if (this.is_move_promotion(move_data)) {
        let promotion = await this.getPromotion() // "q" TODO -- decide which piece to promote to
        if(!promotion){
          return false
        }
        move_data.promotion = promotion
      }
      
      let move_allowed = true
      if(this.props.is_move_allowed){ // TODO - should check if it is not the turn of the computer
        // if the function exists try and see if this move is allowed(i don't mean illegal, if the move cannot be done for other reasons)
        move_allowed = this.props.is_move_allowed(this.props.op_index, this.state.json_moves, move_data)
      }
      if(move_allowed){ // allowed as default
        // MAKE THE MOVE
        let moves_list_after = await this.make_move(move_data)
        if(this.props.playColor !== "both"){
          this.pc_move(this.props.op_index, moves_list_after)
        }
      }else{
        this.play_error_sound()
        return false
      }

      return true
    }else{
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

  getPromotion(){
      return new Promise((res, rej) => {
        this.setState({promotionPromiseRes: res, promotionModalVisible: true})
      })
  }

  try_undo(){
    /* I can undo if there is some move to undo */
    if(this.state.json_moves.length > 0){
      // actually undo
      this.state.game.undo()
      // pop the move out of the list of all moves of the game 
      this.setState(old => {
        let moves_list = old.json_moves
        moves_list.pop()
        return{
          json_moves: moves_list
        }
      })
    }else{
      console.log("Cannot undo before any move is done")
    }
  }

  pc_move(op_index, json_moves){
    let move_data = this.props.get_pc_move_data(op_index, json_moves)
    if(move_data !== null){
      setTimeout(() => this.make_move(move_data), 500)
    }else{
      alert("training finished")
    }
  }

  /* ---------------------------- BOARD MANAGEMENT ---------------------------- */

  cellCoordinates(cell, rotated = this.state.rotated || false) {
    const letter = cell[0]
    const number = cell[1]
    if (!rotated) {
      return { x: cells[letter], y: cells[number] }
    } else {
      return { x: cellsRotated[letter], y: cellsRotated[number] }
    }
  }

  pieceObj(type, cell, id) {
    let coor = cell // cell can be {x: "100%", y: "300%"} or "d4"
    let cell_str
    if (typeof cell === "string") {
      coor = this.cellCoordinates(cell)
      cell_str = cell
    }else{
      cell_str = this.cellFromCoor(coor) /* , false */
    }

    const svg = this.getPieceSrc(type)
    const is_selected = this.state.selected_cell === cell_str
    return  <img 
              style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} 
              src={svg} 
              id={"piece" + id} 
              key={"piece" + id}
              ref={is_selected ? this.selectedPiece : null}
              className={is_selected ? "pieceSVG noAnimationPiece" : "pieceSVG"} /* && on_drag  */
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
          let type = piecesName[piece.color === "b" ? piece.type : piece.type.toUpperCase()] // get the type in this form: "white_king"
          if(!rotated){
            objects.push({ collumn, line, type, id: piece.id })
          }else{
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
    let type =  piecesName[piece.color === "b" ? piece.type : piece.type.toUpperCase()]
    return <img style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} src={this.getPieceSrc(type)} className="selection" key="selection" id="selection" alt="selection" />
  }

  touchCircle(){
    let over = this.state.mouse_over_cell
    let sel = this.state.selected_cell
    if (over === undefined || sel === undefined || !dragged_away) return <div key="touchCircle"/>
    
    let coor = this.cellCoordinates(over)

    return <div style={{ transform: `translate(${coor.x/1.5 - 17.25}%, ${coor.y/1.5 - 19.75}%)` }} key="touchCircle" id="touchCircle" />

    /*if(!this.state.selected_cell || !on_drag) return <div key="touchCircle" ref={this.touchCircleRef} />
    let coor = this.cellCoordinates(this.cellFromCoor(this.state.selected_cell))
    return <div id="touchCircle" ref={this.touchCircleRef} key="touchCircle" style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} />*/
  }

  cellFromCoor(coor, rotated = this.state.rotated || false) {
    // coor: {x: "100", y: "700"}
    if (!rotated) {
      return cellCoords[coor.x + "x"] + cellCoords[coor.y + "y"]
    } else {
      return cellCoordsRotated[coor.x + "x"] + cellCoordsRotated[coor.y + "y"]
    }
  }

  selectCell(cell) {
    // cell: "d4"
    this.setState({ selected_cell: cell })
  }

  deselectCells() {
    this.setState({ selected_cell: undefined })
  }

  try_select_cell(cell) {
    let cell_obj = this.state.game.get(cell)
    if (cell_obj !== null) {
      if (cell_obj.color === this.state.game.turn()) {
        if(this.props.playColor === "both" || this.props.playColor[0] === cell_obj.color){ // for example "white"[0] === "w" => true
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
      if(res){
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

  async boardDown(e){
    let clientX = e.clientX
    let clientY = e.clientY
    if(e.type === "touchstart"){
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

      if(this.state.selected_cell && this.is_move_legal){
        await this.try_move({to: cell})
      }

      const selection_res = this.try_select_cell(cell)
      on_drag = selection_res ? true : false
      left_mouse_down = true
      this.setState({mouse_over_cell: cell})
    }
  }

  async boardUp(e){
    if(this.state.selected_cell && this.selectedPiece.current){
       // (both variables) stored here to avoid losing it, before resetting piece offset, by deselecting
      const draggedPiece = this.selectedPiece.current

      // find the coordinates of the mouse
      let clientX = e.clientX
      let clientY = e.clientY
      if(e.type === "touchend"){
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
        const try_move_res = await this.try_move({to: cell})
        if(!try_move_res && cell){
          this.try_select_cell(cell)
        }else if(cell){
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

  boardDrag(e){
    if(this.state.selected_cell && this.selectedPiece.current && left_mouse_down && on_drag){
      let clientX = e.clientX
      let clientY = e.clientY
      
      if(e.type === "touchmove"){
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
        this.setState({mouse_over_cell: cell})
      }
    }
  }

  async play_move_sound(move){
    // move is what the game.move() function returns
    if(move){
      if(move.flags.indexOf("c") !== -1 || move.flags.indexOf("e") !== -1){
        capture_audio.play()
      }else{
        move_audio.play()
      }
    }
  }

  async play_error_sound(){
    error_audio.play()
  }


  /* ---------------------------- UI ELEMENTS ---------------------------- */

  next_button_click(){
    let move_data = this.props.get_vari_next_move_data(this.props.op_index, this.props.vari_index, this.state.json_moves)
    if(move_data !== null){
      this.make_move(move_data)
    }
  }

  boardButtons(){
    let b_objects = []
    if(this.props.buttons){
      // BACK
      if(this.props.buttons.indexOf("back") !== -1){
        b_objects.push(
          <button id="backButton" key="backButton" className="simpleButton boardButton" onClick={this.try_undo}>keyboard_arrow_left</button>
        )
      }
      // CREATE VARIATION BUTTON - DONE
      if(this.props.buttons.indexOf("done") !== -1){
        b_objects.push(
          <button 
            id="doneButton" 
            key="doneButton" 
            className="simpleButton boardButton" 
            onClick={this.openVariNameModal}
            style={{color: "var(--importantButtonColor)", backgroundColor: "var(--importantButtonBackColor)"}}
          >done</button>
        )
      }
      // HELP
      if(this.props.buttons.indexOf("help") !== -1){
        b_objects.push(
          <button id="helpButton" key="helpButton" className="simpleButton boardButton">live_help</button>
        )
      }
      // NEXT
      if(this.props.buttons.indexOf("next") !== -1){
        b_objects.push(
          <button id="nextButton" key="nextButton" className="simpleButton boardButton" onClick={this.next_button_click} >keyboard_arrow_right</button>
        )
      }
    }
    return b_objects
  }

  comment(){
    console.log()
    if (this.props.op_index === undefined || !this.state.json_moves) return ""
    let text = this.props.getComment(this.props.op_index, this.state.json_moves)
    return <span>{text}</span>
  }

  closeVariNameModal(){
    this.setState({variNameModalVisible: false})
  }

  openVariNameModal(){
    this.setState({variNameModalVisible: true})
  }

  createThisVariation(){
    /*let vari_index = */this.props.createVari(this.state.new_vari_name, this.state.json_moves, this.props.op_index)
    this.props.history.push("/openings/" + this.props.op_index)
  }

  onBoardDataClick(){
    if(this.props.allowCommentEdit){
      this.setState({commentModalVisible: true})
    }
  }

  /* ---------------------------- TEDEOUS JOB ---------------------------- */

  getPieceSrc(name) {
    switch (name) {
      case "white_king":
        return whiteKingSVG
      case "white_queen":
        return whiteQueenSVG
      case "white_rook":
        return whiteRookSVG
      case "white_bishop":
        return whiteBishopSVG
      case "white_knight":
        return whiteKnightSVG
      case "white_pawn":
        return whitePawnSVG
      case "black_king":
        return blackKingSVG
      case "black_queen":
        return blackQueenSVG
      case "black_rook":
        return blackRookSVG
      case "black_bishop":
        return blackBishopSVG
      case "black_knight":
        return blackKnightSVG
      case "black_pawn":
        return blackPawnSVG
      default:
        return undefined
    }
  }
}

export default Board
