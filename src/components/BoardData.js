import React, { Component } from "react"
import SwipeableViews from 'react-swipeable-views';
import Tree from "./Tree"
import { process_comment } from "../utilities/san_parsing"

class BoardData extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tab: 0,
      tabIcons: ["comment", "list"],
    }
    this.setTab = this.setTab.bind(this);
  }

  setTab(i) {
    this.setState({ tab: i })
  }

  render() {
    return <div id="boardData" key="boardData">

      <div id="boardDataTabIconsContainer">
        {
          this.state.tabIcons.map((t, index) =>
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
          <div id="boardDataCommentSlide" className="boardDataSlide"
            onClick={this.props.onCommentClick}
          >
            {this.props.thereIsComment
              ? this.comment()
              : <div id="noCommentIcon" className="iconText">comment</div>
            }
          </div>
          <div id="boardDataTreeSlide" className="boardDataSlide">
            <Tree
              json_moves={this.props.json_moves}
              getComment={this.props.getComment}
              op_index={this.props.op_index}
            />
          </div>
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
