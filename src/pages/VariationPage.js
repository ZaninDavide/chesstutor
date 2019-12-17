import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"

class VariationPage extends Component {
  constructor(props) {
    super(props)

    if (props.ops.length < props.match.params.op_index) {
      console.log("VariationPage: constructor: This opening do not exists.")
    }
  }

  render() {
    const op_index = this.props.match.params.op_index
    const op = this.props.ops[op_index]
    const vari_index = this.props.match.params.vari_index
    const vari = op.variations[vari_index]
    return (
      <React.Fragment>
        <Header title={vari.vari_name} />
        <Board history={this.props.history} createVari={this.props.createVari} op_index={op_index} />
      </React.Fragment>
    )
  }
}

export default VariationPage
