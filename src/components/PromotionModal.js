import React, { Component } from "react"
import "../styles/Modal.css"

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

class PromotionModal extends Component {
  constructor(props) {
    super(props)
    this.getStyle = this.getStyle.bind(this);
    this.close = this.close.bind(this);
  }

  getStyle(){
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
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
