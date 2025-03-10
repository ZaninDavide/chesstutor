import React, { Component } from "react"
import SwipeableViews from 'react-swipeable-views';
import Tree from "./Tree"
import { process_comment } from "../utilities/san_parsing"
import StockfishUI from "./StockfishUI";
import BookUI from "./BookUI";
import VariInfoUI from "./VariInfoUI";
import { getEco } from "../utilities/eco_codes"
import MovesTable from "./MovesTable";

const tab_to_icon = {
  "moves": "list",
  "book": "menu_book",
  "stockfish": "miscellaneous_services",
  "vari_info": "info",
  "moves_table": "format_list_numbered"
}

class BoardData extends Component {

  constructor(props) {
    super(props)
    let starterTab = this.props.match ? (this.props.match.params.tab !== undefined ? 
      Math.min(this.props.tabs.length - 1, Math.max(0, this.props.tabs.indexOf(this.props.match.params.tab))) : 0): 0
    
    this.state = {
      tab: starterTab,
    }
    this.setTab = this.setTab.bind(this);
  }

  setTab(i) {
    this.setState({ tab: i })
  }

  render() {
    let tabs = []
    let extra_info_bar = []

    // MOVES TAB
    if (this.props.tabs.indexOf("moves") !== -1) {
      const tabTree =
        <div id="boardDataTreeSlide" key="boardDataTreeSlide" className="boardDataSlide">
          <Tree key="tree"
            json_moves={this.props.json_moves}
            getComment={this.props.getComment}
            getDrawBoardPDF={this.props.getDrawBoardPDF}
            op_index={this.props.op_index}
            try_undo_n_times={this.props.try_undo_n_times}
            rotated={this.props.rotated}
          />
        </div>
      tabs.push(tabTree)
    }    
    
    // MOVES TABLE TAB
    if (this.props.tabs.indexOf("moves_table") !== -1) {
      const tabMovesTable =
        <div id="boardDataMovesTableSlide" key="boardDataMovesTableSlide" className="boardDataSlide">
          <MovesTable key="tree"
            json_moves={this.props.json_moves}
            moves_forward={this.props.moves_forward}
            try_undo_n_times={this.props.try_undo_n_times}
            try_redo_n_times={this.props.try_redo_n_times}
          />
        </div>
      tabs.push(tabMovesTable)
    }

    // VARIATION INFO TAB
    if (this.props.tabs.indexOf("vari_info") !== -1) {
      const tabVariInfo =
        <div id="boardDataVariInfoSlide" key="boardDataVariInfoSlide" className="boardDataSlide">
          <VariInfoUI key="variInfo"
            vari_index={this.props.vari_index}
            vari_name={this.props.vari_name}
            vari_subname={this.props.vari_subname}
          />
        </div>
      tabs.push(tabVariInfo)
    }

    // BOOK TAB
    if (this.props.tabs.indexOf("book") !== -1) {
      const tabBook =
        <div id="boardDataBookSlide" key="boardDataBookSlide" className="boardDataSlide">
          <BookUI key="book"
            json_moves={this.props.json_moves}
            getComment={this.props.getComment}
            get_correct_moves_data_book={this.props.get_correct_moves_data_book}
            book_move={this.props.book_move}
            ops={this.props.ops}
            match={this.props.match}
            op_index={this.props.op_index}
            opQuery={this.props.book_query_op_index}
            variQuery={this.props.book_query_vari_name}
            subnameQuery={this.props.book_query_vari_subname}
            set_book_query_op_index={this.props.set_book_query_op_index}
            set_book_query_vari_name={this.props.set_book_query_vari_name}
            set_book_query_vari_subname={this.props.set_book_query_vari_subname}
            set_book_query={this.props.set_book_query}
          />
        </div>
      tabs.push(tabBook)
    }

    // STOCKFISH TAB
    if (this.props.tabs.indexOf("stockfish") !== -1) {
      const tabStockfish = <StockfishUI key="stockfishUI"
        stockfish={this.props.stockfish}
        get_fen={this.props.get_fen}
        board_mode={this.props.board_mode}

        stockfish_switch_show_best={this.props.stockfish_switch_show_best}
        stockfish_switch_show_eval={this.props.stockfish_switch_show_eval}
        stockfish_set_depth={this.props.stockfish_set_depth}
        stockfish_switch_use_lichess_cloud={this.props.stockfish_switch_use_lichess_cloud}
      />

      let stockfish_extra = <React.Fragment key="stockfishExtraFragment">
        <span id="boardDataTabTopBarExtraInfoEvaluation" key="boardDataTabTopBarExtraInfoEvaluation">
          {this.props.stockfish.show_eval ? this.props.stockfish.eval : null}
        </span>
        &nbsp;
        {
          this.props.stockfish.show_eval || this.props.stockfish.show_best ? (
            "(" + this.props.stockfish.calculated_depth + "/" + this.props.stockfish.depth + ")"
          ) : null
        }
      </React.Fragment>

      tabs.push(tabStockfish)
      if(this.props.stockfish.show_eval || this.props.stockfish.show_best) {
        extra_info_bar.push(stockfish_extra)
      }
    }

    let separator = <span key="separator_extra_bar">&nbsp;&nbsp;</span>

    // OPENING TITLE - EXTRA INFO
    if (this.props.tabs.indexOf("op_name") !== -1) {
      let op_name_extra = <span key="opening_title">{this.props.vari_op_name || ""}</span>

      if(extra_info_bar.length > 0) extra_info_bar.push(separator)
      extra_info_bar.push(op_name_extra)
    }

    // OPENING ECO - EXTRA INFO
    if (this.props.tabs.indexOf("op_eco") !== -1) {
      let eco = getEco(this.props.json_moves.map(m => m.san))
      let op_eco_extra = <span key="opening_eco">{eco ? eco.long_name : ""}</span>

      if(extra_info_bar.length > 0) extra_info_bar.push(separator)
      extra_info_bar.push(op_eco_extra)
    }

    // SMART TRAINING GOAL BAR - EXTRA INFO
    let goal_bar = <div></div>
    if (this.props.tabs.indexOf("goal_bar") !== -1 && this.props.settings.depth_goal > 0) {
      // let to_study = true
      let total = 0
      if(this.props.stats && this.props.stats[this.props.today_str]){
          const stats = this.props.stats[this.props.today_str]
          total = stats.white_moves + stats.black_moves;
          // to_study = total < this.props.settings.moves_goal
      }
      let percentage = total / this.props.settings.moves_goal * 100
      goal_bar = <div key="goalBar" id="goalBar" style={{backgroundImage: `-webkit-linear-gradient(left, var(--main) 0%, var(--main) ${percentage}%, var(--onBack) ${percentage}%, var(--onBack) 100%)`}}></div>
    }

    return <div id="boardData" key="boardData">

    { this.props.tabs.length > 1 ?
      <div id="boardDataTabTopBar">
        {goal_bar}
        <div id="boardDataTabTopBarExtraInfo">
          {this.props.tabs.length > 1 || extra_info_bar.length ? extra_info_bar : null}
        </div>
        <div id="boardDataTabIconsContainer">
        {
          this.props.tabs.filter(c => tab_to_icon[c]).map((t, index) =>
            <div
              className={"boardDataTabIcon" + (this.state.tab === index ? " impText" : "")}
              key={"boardDataTabIcon_" + t}
              onClick={() => this.setTab(index)}
            >{tab_to_icon[t]}</div>
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
