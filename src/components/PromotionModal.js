import React, { Component } from "react"
import "../styles/Modal.css"

const whiteKingSVG = "/files/white_king.svg"
const whiteQueenSVG = "/files/white_queen.svg"
const whiteRookSVG = "/files/white_rook.svg"
const whiteKnightSVG = "/files/white_knight.svg"
const whitePawnSVG = "/files/white_pawn.svg"
const whiteBishopSVG = "/files/white_bishop.svg"
const blackKingSVG = "/files/black_king.svg"
const blackQueenSVG = "/files/black_queen.svg"
const blackRookSVG = "/files/black_rook.svg"
const blackKnightSVG = "/files/black_knight.svg"
const blackPawnSVG = "/files/black_pawn.svg"
const blackBishopSVG = "/files/black_bishop.svg"

class PromotionModal extends Component {
  constructor(props) {
    super(props)
    this.getStyle = this.getStyle.bind(this);
    this.close = this.close.bind(this);
  }

  getStyle(){
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
    }
  }

  close(){
    this.props.promotionPromiseRes(false) // piece_name[0] gets first char of the name
    this.props.close()
  }

  choosePiece(piece_name){
    let names = {
      "queen": "q",
      "rook": "r",
      "knight": "n",
      "bishop": "b"
    }
    this.props.promotionPromiseRes(names[piece_name]) // piece_name[0] gets first char of the name
    this.props.close()
  }

  getPieceButtons(){
    let objects = []
    let piece_names = ["queen", "rook", "bishop", "knight"]
    let color = this.props.color === "w" ? "white" : "black"
    piece_names.forEach(piece_name => {
      objects.push(
        <button onClick={() => this.choosePiece(piece_name)} className="simpleButton promotionButton" id={"promotionButton" + piece_name} key={"promotionButton" + piece_name} >
          <img className="promotionPiece" src={this.getPieceSrc(color + "_" + piece_name)} alt="Promotion Piece" />
        </button>
      )
    });
    return objects
  }

  render() {
    return (
      <div id="promotionModal" className="modal" onClick={this.close} style={this.getStyle()}>
        <div className="modalContent" onClick={e => e.stopPropagation()} style={{height: "auto"}}>
          {this.getPieceButtons()}
        </div>
      </div>
    )
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

export default PromotionModal
