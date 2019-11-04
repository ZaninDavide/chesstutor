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

class Board extends Component {
  constructor(props) {
    super(props)

    this.state = {
      game: new Chess(),
      json_moves: [], // moves' history in the correct format (see vari.moves)
      selected_cell: undefined // undefined or "d4"
    }

    this.newGame = this.newGame.bind(this)
    this.testChess = this.testChess.bind(this)
    this.selectCell = this.selectCell.bind(this)
    this.deselectCells = this.deselectCells.bind(this)
    this.boardClick = this.boardClick.bind(this)
    this.clickCell = this.clickCell.bind(this)
    this.try_undo = this.try_undo.bind(this)
  }

  /* ---------------------------- COMPONENT ---------------------------- */

  render() {
    console.log("render")
    return (
      <div id="boardGrid">
        <div id="boardContainer" onClick={this.boardClick} onDragOver={ev => ev.preventDefault()} onDrop={this.boardClick} ref={"bContainer"} key="boardContainer">
          {this.selection()}
          {this.pieces()}
          <img id="boardSVG" src={boardSVG} alt={"Board file missing"} ref="board" key="board" />
        </div>
        <div id="boardUI">
          {this.boardButtons()}
        </div>
        <div id="boardData">
          Comment: ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao ciao 
        </div>
      </div>
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
    if (this.is_move_promotion(move_data)) {
      let promotion = "q"
      move_data.promotion = promotion
    }
    this.make_move(move_data)
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
    if (typeof cell === "string") {
      coor = this.cellCoordinates(cell)
    }
    const svg = this.getPieceSrc(type)
    return <img style={{ transform: `translate(${coor.x}%, ${coor.y}%)` }} src={svg} id={"piece" + id} key={"piece" + id} className="pieceSVG" alt={"Piece file missing"} draggable="true" onDragStart={this.boardClick} />
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
    if (cell_obj === null) {
      this.deselectCells()
    } else {
      if (cell_obj.color === this.state.game.turn()) {
        this.selectCell(cell)
      }
    }
  }

  clickCell(cell) {
    // if something is selected try to move there
    if (this.state.selected_cell !== undefined) {
      let legal_moves = this.state.game.moves({ square: this.state.selected_cell, verbose: true }).map(cur => cur.to)
      if (legal_moves.includes(cell)) {
        // if i have a piece selected and i can move there
        this.try_move({ from: this.state.selected_cell, to: cell })
        this.deselectCells()
      } else {
        // if i have a piece selected but i can't move there
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

  /* ---------------------------- UI ELEMENTS ---------------------------- */

  boardButtons(){
    return <React.Fragment>
      <button className="simpleButton boardButton" onClick={this.try_undo}>keyboard_arrow_left</button>
      <button className="simpleButton boardButton">done</button>
      <button className="simpleButton boardButton">emoji_objects</button>
    </React.Fragment>
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
