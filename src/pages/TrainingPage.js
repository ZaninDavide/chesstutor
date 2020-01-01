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

    return (
      <React.Fragment>
        <Header title={op.op_name} />
        <Board history={this.props.history} op_index={op_index} />
      </React.Fragment>
    )
  }
}

export default VariationPage
