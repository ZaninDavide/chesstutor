import React, { Component } from "react"
import "../styles/Modal.css"
import {make_san_nicer_html} from "../utilities/san_parsing"

class HelpModal extends Component {
  constructor(props) {
    super(props)
    this.close = this.close.bind(this);
    this.chooseMove = this.chooseMove.bind(this);
  }

  close(){
    this.props.close()
  }

  async chooseMove(move){
    let moves_list_after = await this.props.make_move(move)
    // COMPUTER ANSWER IF NECESSARY
    if(this.props.playColor !== "both"){
      this.props.pc_move(this.props.op_index, moves_list_after, this.props.vari_index)
    }
    this.props.close()
  }

  getMovesButtons(correct_moves, json_moves_length){
    let objects = []
    correct_moves.forEach(move => {
      objects.push(
        <button onClick={() => this.chooseMove(move)} className="simpleButton helpModalButton" id={"helpModalButton_" + move.san} key={"helpModalButton_" + move.san} >
          <h2 style={{lineHeight: "100%"}}>
            {Math.floor(json_moves_length / 2) + 1}{". "}<React.Fragment dangerouslySetInnerHTML={{ __html: make_san_nicer_html(move.san)}} />
          </h2>
        </button>
      )
    });
    return objects
  }

  render() {
    return (
      <div id="helpModal" className={"modal" + (this.props.visible ? " modalVisible" : " modalHidden")} onClick={this.close}>
        <div className="helpModalContent" onClick={e => e.stopPropagation()} style={{height: "auto"}}>
          {this.getMovesButtons(this.props.correct_moves, this.props.json_moves_length)}
        </div>
      </div>
    )
  }


  /* ---------------------------- TEDEOUS JOB ---------------------------- */

  getPieceText(name) {
    switch (name) {
      case "white_king":
        return "♔"
      case "white_queen":
        return "♕"
      case "white_rook":
        return "♖"
      case "white_bishop":
        return "♗"
      case "white_knight":
        return "♘"
      case "white_pawn":
        return "♙"
      case "black_king":
        return "♚"
      case "black_queen":
        return "♛"
      case "black_rook":
        return "♜"
      case "black_bishop":
        return "♝"
      case "black_knight":
        return "♞"
      case "black_pawn":
        return "♟"
      default:
        return undefined
    }
  }

}

export default HelpModal
