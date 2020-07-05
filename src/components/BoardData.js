import React, { Component } from "react"
import SwipeableViews from 'react-swipeable-views';
import Tree from "./Tree"
import { process_comment } from "../utilities/san_parsing"

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
          <div id="boardDataTreeSlide" className="boardDataSlide">
            <Tree json_moves={this.props.json_moves}/>
          </div>
        </SwipeableViews>
      </div>
    </div>
  }

  comment(){
    if (this.props.op_index === undefined || !this.props.json_moves) return ""
    let text = this.props.getComment(this.props.op_index, this.props.json_moves)
    text = process_comment(text)

    return <span dangerouslySetInnerHTML={{__html: text}} />
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
