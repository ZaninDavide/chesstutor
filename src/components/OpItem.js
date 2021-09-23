import React, { Component } from "react"
import Translator from "./Translator"
import Ripples from "react-ripples"

class OpItem extends Component {
  constructor(props) {
    super(props)
    this.openOp = this.openOp.bind(this)
    this.rightClick = this.rightClick.bind(this)
    this.menuButtonClick = this.menuButtonClick.bind(this)
  }

  openOp() {
    this.props.history.push("/openings/" + this.props.op_index.toString())
  }

  menuButtonClick(e) {
    e.stopPropagation()
    this.props.hMenuOpen(this.props.op_index)
  }

  rightClick(e) {
    this.props.hMenuOpen(this.props.op_index)

    /* avoids the menu to open */
    e.preventDefault()
    return false
  }

  render() {
    return <>
      <Ripples
        className="opItem"
        onClick={this.openOp}
      >
        <div className="opItemText" onContextMenu={this.rightClick}>
          <h2>{this.props.op.op_name}</h2>
          <p className="smallText">
            <Translator text={this.props.op.op_color} />{" ⋅ "}{this.props.op.variations.length} <Translator text={this.props.op.variations.length === 1 ? "variation" : "variations"} />
          </p>
        </div>
        <div className="opItemButton iconText" onClick={this.menuButtonClick}>
          more_vert
        </div>
      </Ripples>
      <hr />
    </>
  }
}

export default OpItem
