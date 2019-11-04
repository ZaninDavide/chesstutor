import React, { Component } from "react"
import Translator from "./Translator"

class VariItem extends Component {
  constructor(props) {
    super(props)
    this.openVari = this.openVari.bind(this)
  }

  openVari() {
    this.props.history.push("/openings/" + this.props.op_index.toString() + "/" + this.props.vari_index.toString())
  }

  render() {
    return (
      <div className="variItem" onClick={this.openVari}>
        <h2>{this.props.vari.vari_name}</h2>
        <p>
          {this.props.vari.moves.length} <Translator text={this.props.vari.moves.length === 1 ? "move" : "moves"} />
        </p>
      </div>
    )
  }
}

export default VariItem
