import React, { Component } from "react"
import Translator from "./Translator"
import Ripples from "react-ripples"

class OpItem extends Component {
  constructor(props) {
    super(props)
    this.openOp = this.openOp.bind(this)
    this.rightClick = this.rightClick.bind(this)
  }

  openOp() {
    this.props.history.push("/openings/" + this.props.op_index.toString())
  }

  rightClick(e){
    e.preventDefault() /* avoids the menu to open */
    this.props.hMenuOpen(this.props.op_index)
    return false /* avoids the menu to open */
  }

  render() {
    return (
      <Ripples 
        className="opItem" 
      >
        <div className="opItemText" onClick={this.openOp} onContextMenu={this.rightClick}>
          <h2>{this.props.op.op_name}</h2>
          {<p className="smallText">
            <Translator text={this.props.op.op_color} />{" ⋅ "}{this.props.op.variations.length} <Translator text={this.props.op.variations.length === 1 ? "variation" : "variations"} />
          </p>}
        </div>
        <div className="opItemButton iconText" onClick={this.rightClick}>
          more_vert
        </div>
      </Ripples>
    )
  }
}

export default OpItem
