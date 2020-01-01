import React, { Component } from "react"
//import Chess from "chess.js"
import Chess from "../chessjs-chesstutor/chess.js"

import boardSVG from "../files/chessboard.svg"
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
import selectionSVG from "../files/selection.svg"

import Modal from "../components/Modal"
import Translator from "../components/Translator"

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
let drag_coor = {x: 0, y: 0}

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      game: new Chess(),
      json_moves: [], // moves' history in the correct format (see vari.moves)
      selected_cell: undefined, // undefined or "d4"
      variNameModalVisible: false,
      new_vari_name: "",
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
    this.moveCircle = this.moveCircle.bind(this)
    /* refs */
    this.selectedPiece = React.createRef()
  }

  /* ---------------------------- COMPONENT ---------------------------- */

  render() {
    console.log("render")
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
            {/*this.moveCircle()*/}
            {this.pieces()}
            <img id="boardSVG" src={boardSVG} alt={"Board file missing"} ref="board" key="board" draggable={false} />
          </div>
          <div id="boardUI">
            {this.boardButtons()}
          </div>
          <div id="boardData">
            Comments: ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao 
          </div>
        </div>
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
      </React.Fragment>
    )
  }

  componentDidMount() {
    // called when the component is first created
    this.testChess() // test

    // detect the back button click
    window.onpopstate = e => {
      // this.props.history.go(1);
      e.preventDefault()
      return false
    };
  }

  /* ---------------------------- DEBUG ---------------------------- */

  testChess() {
    /*this.make_move("d4")
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
    console.log(this.state.game.board())*/
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

  make_move(move_data) {
    // move data can be a string(SAN): "Nxd4"
    // or an object: {from: "d2", to: "d5", promotion: undefined}
    let move = this.state.game.move(move_data)
    this.setState(old => {
      let moves_list = old.json_moves
      // adding the new move to the history array in the correct format
      moves_list.push({
        from: move.from,
        to: move.to,
        promotion: move.promotion,
        san: move.san,
      })
      return {
        json_moves: moves_list
      }
    })
  }

  try_move(move_data) {
    // move data is an object: {from: "d2", to: "d5", promotion: undefined}
    // as default move_data.from = this.state.selectedCell
    if(move_data.from === undefined){
      if(this.state.selected_cell === undefined){return false}
      move_data.from = this.state.selected_cell
    }
    if(this.is_move_legal(move_data)){
      if (this.is_move_promotion(move_data)) {
        let promotion = "q" /* TODO -- decide which piece to promote to */
        move_data.promotion = promotion
      }
      this.make_move(move_data)
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
      cell_str = this.cellFromCoor(coor, false)
    }

    const svg = this.getPieceSrc(type)
    const is_selected = this.state.selected_cell === cell_str
    return  <img 
              style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} 
              src={svg} 
              id={"piece" + id} 
              key={"piece" + id}
              ref={is_selected ? this.selectedPiece : null}
              className={is_selected && on_drag ? "pieceSVG dragging" : "pieceSVG"} 
              alt={"Piece file missing"}
              draggable={false}
            />
  }

  pieces() {
    let objects = []
    let board = this.state.game.board()
    for (let line = 0; line < 8; line++) {
      for (let collumn = 0; collumn < 8; collumn++) {
        // get the piece from the array
        let piece = board[line][collumn]
        if (piece !== null) {
          // if the cell is not empty
          let type = piecesName[piece.color === "b" ? piece.type : piece.type.toUpperCase()] // get the type in this form: "white_king"
          objects.push({ collumn, line, type, id: piece.id })
        }
      }
    }
    objects.sort((a, b) => a.id - b.id) // sort pieces to avoid errors with chrome. unecessary with edge
    return objects.map(({ collumn, line, id, type }) => this.pieceObj(type, { x: `${collumn * 100}`, y: `${line * 100}` }, id)) // get the piece object
  }

  selection() {
    let sel = this.state.selected_cell
    if (sel === undefined) return <div key="selection" id="selection" />
    let coor = this.cellCoordinates(sel)
    return <img style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} src={selectionSVG} className="selection" key="selection" id="selection" alt="selection" />
  }

  moveCircle(){
    let coor = this.cellCoordinates(this.cellFromCoor(drag_coor))
    return on_drag ? <div id="moveCircle" style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} /> : <div id="moveCircle" />
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
        this.selectCell(cell)
        return true
      }
    }
    this.deselectCells()
    return false
  }

  clickCell(cell) {
    // if something is selected try to move there
    if (this.state.selected_cell !== undefined) {
      let res = this.try_move({ from: this.state.selected_cell, to: cell }) // true = move done; false = move not done because illegal
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

  boardDown(e){
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
        this.try_move({to: cell})
      }

      const selection_res = this.try_select_cell(cell)
      on_drag = selection_res ? true : false
      left_mouse_down = true
    }
  }

  boardUp(e){
    if(this.state.selected_cell && this.selectedPiece){
      let clientX = e.clientX
      let clientY = e.clientY
      if(e.type === "touchend"){
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }
      const coor = { x: clientX - this.refs.bContainer.offsetLeft, y: clientY - this.refs.bContainer.offsetTop }
      coor.x = Math.floor((coor.x / this.refs.board.width) * 8) * 100
      coor.y = Math.floor((coor.y / this.refs.board.width) * 8) * 100
      if (coor.x <= 700 && coor.y <= 700) {
        // inside the board
        const cell = this.cellFromCoor(coor)
        // try to move there
        const try_move_res = this.try_move({to: cell})
        if(!try_move_res){
          this.try_select_cell(cell)
        }else{
          this.deselectCells()
        }
      }
      // reset dragging
      clientX_down = 0
      clientY_down = 0
      if(this.selectedPiece.current){
        this.selectedPiece.current.style.left = "0px"
        this.selectedPiece.current.style.top = "0px"
      }
    }
    on_drag = false
    left_mouse_down = false
  }

  boardDrag(e){
    if(this.state.selected_cell && this.selectedPiece.current && left_mouse_down && on_drag){
      let clientX = e.clientX
      let clientY = e.clientY
      
      if(e.type === "touchmove"){
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      // moveCircle
      const coor = { x: clientX - this.refs.bContainer.offsetLeft, y: clientY - this.refs.bContainer.offsetTop }
      coor.x = Math.floor((coor.x / this.refs.board.width) * 8) * 100
      coor.y = Math.floor((coor.y / this.refs.board.width) * 8) * 100
      coor.x = coor.x > 700 ? 700 : coor.x
      coor.y = coor.y > 700 ? 700 : coor.y
      coor.x = coor.x < 0 ? 0 : coor.x
      coor.y = coor.y < 0 ? 0 : coor.y
      drag_coor = coor
      
      //move piece
      let deltaX = clientX - clientX_down
      let deltaY = clientY - clientY_down

      this.selectedPiece.current.style.left = deltaX + "px"
      this.selectedPiece.current.style.top = deltaY + "px"
    }
  }

  /* ---------------------------- UI ELEMENTS ---------------------------- */

  boardButtons(){
    return <React.Fragment>
      {/* BACK */}
      <button className="simpleButton boardButton" onClick={this.try_undo}>keyboard_arrow_left</button>
      {/* CREATE VARIATION BUTTON */}
      <button 
        className="simpleButton boardButton" 
        onClick={this.openVariNameModal} 
        style={{color: "var(--importantButtonBackColor)"}}
      >done</button>
      {/* HELP */}
      <button className="simpleButton boardButton">live_help</button> {/* wb_incandescent */}
    </React.Fragment>
  }

  closeVariNameModal(){
    console.log("close")
    this.setState({variNameModalVisible: false})
  }

  openVariNameModal(){
    console.log("open")
    this.setState({variNameModalVisible: true})
  }

  createThisVariation(){
    /*let vari_index = */this.props.createVari(this.state.new_vari_name, this.state.json_moves, this.props.op_index)
    this.props.history.push("/openings/" + this.props.op_index)
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
