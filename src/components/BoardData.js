import React, { Component } from "react"
import SwipeableViews from 'react-swipeable-views';
import Tree from "./Tree"
import { process_comment } from "../utilities/san_parsing"
import CheckBox from "../components/CheckBox"

class BoardData extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tab: 0,
    }
    this.setTab = this.setTab.bind(this);
  }

  setTab(i) {
    this.setState({ tab: i })
  }

  render() {
    let tabs = []

    const tabComment =
      <div id="boardDataCommentSlide" key="boardDataCommentSlide" className="boardDataSlide"
        onClick={this.props.onCommentClick}
      >
        {this.props.thereIsComment
          ? this.comment()
          : <div id="noCommentIcon" className="iconText">comment</div>
        }
      </div>
    tabs.push(tabComment)


    const tabTree =
      <div id="boardDataTreeSlide" key="boardDataTreeSlide" className="boardDataSlide">
        Moves tree:<br />
        <Tree
          json_moves={this.props.json_moves}
          getComment={this.props.getComment}
          op_index={this.props.op_index}
        />
      </div>
    tabs.push(tabTree)

    if (this.props.stockfish) {
      const tabStockfish =
        <div id="boardDataStockfishSlide" key="boardDataStockfishSlide" className="boardDataSlide">
          <h2>{"Stockfish is here now!"}</h2>
          <CheckBox text={"Play against stockfish"} checked={this.props.stockfish.makes_moves} click={this.props.switchStockfish} />
          <p>{"Depth: "}{this.props.stockfish.depth}</p>
          <button className="simpleButton" onClick={this.props.stockfish_find_best_moves}>BEST MOVE</button>
          <br />
          <button className="simpleButton" onClick={this.props.stockfish_eval}>EVALUATE {this.props.stockfish_evaluation}</button>
        </div>
      tabs.push(tabStockfish)
    }

    return <div id="boardData" key="boardData">

      <div id="boardDataTabIconsContainer">
        {
          this.props.tabIcons.map((t, index) =>
            <div
              className={"boardDataTabIcon" + (this.state.tab === index ? " impText" : "")}
              key={"boardDataTabIcon_" + t}
              onClick={() => this.setTab(index)}
            >{t}</div>
          )
        }
      </div>

      <div id="boardDataSwipe" key="boardDataSwipe">
        <SwipeableViews resistance onChangeIndex={this.setTab} index={this.state.tab}>
          {tabs}
        </SwipeableViews>
      </div>
    </div>
  }

  comment() {
    if (this.props.op_index === undefined || !this.props.json_moves) return ""
    let text = this.props.getComment(this.props.op_index, this.props.json_moves)
    text = process_comment(text)

    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

}

export default BoardData
