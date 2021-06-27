import React, { Component } from "react"
import "../styles/Modal.css"
import { get_piece_src } from "../utilities/file_paths"

class PromotionModal extends Component {
  constructor(props) {
    super(props)
    this.close = this.close.bind(this);
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
          <img className="promotionPiece" src={get_piece_src(color + "_" + piece_name)} alt="Promotion Piece" />
        </button>
      )
    });
    return objects
  }

  render() {
    return (
      <div id="promotionModal" className={"modal" + (this.props.visible ? " modalVisible" : " modalHidden")} onClick={this.close}>
        <div id="promotionModalContent" onClick={e => e.stopPropagation()}>
          {this.getPieceButtons()}
        </div>
      </div>
    )
  }

}

export default PromotionModal
