import React, { Component } from "react"
import SwipeableViews from 'react-swipeable-views';
import Tree from "./Tree"
import { process_comment } from "../utilities/san_parsing"
import StockfishUI from "./StockfishUI";
import BookUI from "./BookUI";

import FenViewer from "../components/FenViewer"

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

    if (this.props.tabIcons.indexOf("book") !== -1) {
      const tabBook =
        <div id="boardDataBookSlide" key="boardDataBookSlide" className="boardDataSlide">
          <BookUI key="book"
            json_moves={this.props.json_moves}
            getComment={this.props.getComment}
            get_correct_moves_data_book={this.props.get_correct_moves_data_book}
            book_move={this.props.book_move}
          />
        </div>
      tabs.push(tabBook)
    }

    if (this.props.tabIcons.indexOf("list") !== -1) {
      const tabTree =
        <div id="boardDataTreeSlide" key="boardDataTreeSlide" className="boardDataSlide">
          <Tree key="tree"
            json_moves={this.props.json_moves}
            getComment={this.props.getComment}
            getDrawBoardPDF={this.props.getDrawBoardPDF}
            op_index={this.props.op_index}
            try_undo_n_times={this.props.try_undo_n_times}
          />
        </div>
      tabs.push(tabTree)
    }

    /*
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
    */

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
        set_stockfish_depth={this.props.set_stockfish_depth}
        get_fen={this.props.get_fen}
      />

      tabs.push(tabStockfish)
    }

    return <div id="boardData" key="boardData">

    { this.props.tabIcons.length > 1 ?
      <div id="boardDataTabTopBar">
        <div id="boardDataTabTopBarExtraInfo">
          <span id="boardDataTabTopBarExtraInfoEvaluation">
            {(() => {
                if(this.props.stockfish_evaluation === undefined){
                    return "-"
                }else if(isNaN(this.props.stockfish_evaluation)){
                    return "#"
                }else{
                    return this.props.stockfish_evaluation > 0 ? ("+"+this.props.stockfish_evaluation) : this.props.stockfish_evaluation 
                }
            })()}
          </span>
          &nbsp;
          {"(" + this.props.stockfish_calculated_depth + "/" + this.props.stockfish.depth + ")"}
        </div>
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
      </div> : <div></div> }

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
