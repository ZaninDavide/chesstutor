import React, { Component } from "react"
import SwipeableViews from 'react-swipeable-views';
import Tree from "./Tree"
import { process_comment } from "../utilities/san_parsing"
import StockfishUI from "./StockfishUI";

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

    if (this.props.tabIcons.indexOf("comment") !== -1) {
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
    }

    if (this.props.tabIcons.indexOf("list") !== -1) {
      const tabTree =
        <div id="boardDataTreeSlide" key="boardDataTreeSlide" className="boardDataSlide">
          Moves tree:<br />
          <Tree key="tree"
            json_moves={this.props.json_moves}
            getComment={this.props.getComment}
            op_index={this.props.op_index}
          />
        </div>
      tabs.push(tabTree)
    }

    if (this.props.tabIcons.indexOf("computer") !== -1) {
      const tabStockfish = <StockfishUI key="stockfishUI"
        stockfish={this.props.stockfish}
        stockfish_find_best_moves={this.props.stockfish_find_best_moves}
        stockfish_evaluate={this.props.stockfish_evaluate}
        stockfish_evaluation={this.props.stockfish_evaluation}
        switch_stockfish={this.props.switch_stockfish}
        stockfish_chosen_move={this.props.stockfish_chosen_move}
        switch_auto_eval={this.props.switch_auto_eval}
        switch_auto_best_move={this.props.switch_auto_best_move}
      />

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
