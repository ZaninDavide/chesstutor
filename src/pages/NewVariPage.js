import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"

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
        <Header title={<Translator text={"New variation"} />} />
        <Board 
          history={this.props.history} 
          createVari={this.props.createVari} 
          op_index={op_index} 
          buttons={["back", "done"]}
          rotation={op.op_color}
          playColor={"both"}
        />
      </React.Fragment>
    )
  }
}

export default VariationPage
