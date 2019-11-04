import React, { Component } from "react"
import Translator from "./Translator"

class OpItem extends Component {
  constructor(props) {
    super(props)
    this.openOp = this.openOp.bind(this)
  }

  openOp() {
    this.props.history.push("/openings/" + this.props.op_index.toString())
  }

  render() {
    return (
      <div className="opItem" onClick={this.openOp}>
        <h2>{this.props.op.op_name}</h2>
        <p>
          <Translator text={this.props.op.op_color} />, {this.props.op.variations.length} <Translator text={this.props.op.variations.length === 1 ? "variation" : "variations"} />
        </p>
      </div>
    )
  }
}

export default OpItem
