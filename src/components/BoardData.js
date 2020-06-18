import React, { Component } from "react"
// import Translator from "./Translator"
// import Ripples from "react-ripples"
import SwipeableViews from 'react-swipeable-views';

class BoardData extends Component {

  constructor(props){
    super(props)
    this.state = {
      tab: 0,
      tabIcons: ["comment", "list"],
    }
    this.setTab = this.setTab.bind(this);
  }

  setTab(i){
    this.setState({tab: i})
  }

  render() {
    return <div id="boardData" key="boardData">

      <div id="boardDataTabIconsContainer">
        {
          this.state.tabIcons.map((t, index) => 
            <div className={"boardDataTabIcon" + (this.state.tab === index ? " impText" : "")} onClick={() => this.setTab(index)}>{t}</div>
          )
        }
      </div>

      <div id="boardDataSwipe" key="boardDataSwipe">
        <SwipeableViews resistance onChangeIndex={this.setTab} index={this.state.tab}>
          <div id="boardDataCommentSlide" className="boardDataSlide"
            onClick={this.props.onCommentClick}
          >
            {this.props.thereIsComment 
              ? this.comment() 
              : <div id="noCommentIcon" className="iconText">comment</div>
            }
          </div>
          <div className="boardDataSlide">
            {this.props.json_moves.map(c => this.make_san_nicer(c.san)).join(" ")}
          </div>
        </SwipeableViews>
      </div>
    </div>
  }

  escapeHtml(text) {
    if(!text) return ""
    return text
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  processComment(comment_text){
    let text = this.escapeHtml(comment_text)

    const regex_bold = /\*(.*?)\*/gm;
    const subst_bold = `<b>$1</b>`;
    let mark_down_text = text ? text.replace(regex_bold, subst_bold) : "";

    const regex_line = /_(.*?)_/gm;
    const subst_line = `<u>$1</u>`;
    mark_down_text = mark_down_text ? mark_down_text.replace(regex_line, subst_line) : "";

    /* MAKE MOVES LOOK NICER */
    mark_down_text = mark_down_text.replace(/\$\$Q/g, this.getPieceText("black_queen"))
    mark_down_text = mark_down_text.replace(/\$\$K/g, this.getPieceText("black_king"))
    mark_down_text = mark_down_text.replace(/\$\$N/g, this.getPieceText("black_knight"))
    mark_down_text = mark_down_text.replace(/\$\$B/g, this.getPieceText("black_bishop"))
    mark_down_text = mark_down_text.replace(/\$\$R/g, this.getPieceText("black_rook"))
    mark_down_text = mark_down_text.replace(/\$\$P/g, this.getPieceText("black_pawn"))

    mark_down_text = mark_down_text.replace(/\$Q/g, this.getPieceText("white_queen"))
    mark_down_text = mark_down_text.replace(/\$K/g, this.getPieceText("white_king"))
    mark_down_text = mark_down_text.replace(/\$N/g, this.getPieceText("white_knight"))
    mark_down_text = mark_down_text.replace(/\$B/g, this.getPieceText("white_bishop"))
    mark_down_text = mark_down_text.replace(/\$R/g, this.getPieceText("white_rook"))
    mark_down_text = mark_down_text.replace(/\$P/g, this.getPieceText("white_pawn"))

    return mark_down_text
  }

  comment(){
    if (this.props.op_index === undefined || !this.props.json_moves) return ""
    let text = this.props.getComment(this.props.op_index, this.props.json_moves)
    text = this.processComment(text)

    return <span dangerouslySetInnerHTML={{__html: text}} />
  }

  make_san_nicer(san, color = "white"){
    let new_san = san
    new_san = new_san.replace("Q", this.getPieceText(color + "_queen"))
    new_san = new_san.replace("K", this.getPieceText(color + "_king"))
    new_san = new_san.replace("N", this.getPieceText(color + "_knight"))
    new_san = new_san.replace("B", this.getPieceText(color + "_bishop"))
    new_san = new_san.replace("R", this.getPieceText(color + "_rook"))
    new_san = new_san.replace("P", this.getPieceText(color + "_pawn"))
    return new_san
  }
  
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

export default BoardData
