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
        <Header mainButtonText="keyboard_backspace" goTo={"/openings/" + op_index} title={<React.Fragment><Translator text={"Training"} />{": " + op.op_name}</React.Fragment>} />
        <Board 
          key="trainingBoard"
          history={this.props.history} 
          op_index={op_index}
          buttons={["back", "help"]}
          is_move_allowed={this.props.is_move_allowed}
          get_pc_move_data={this.props.get_pc_move_data}
          rotation={op.op_color}
          playColor={op.op_color}
          editComment={this.props.editComment}
          getComment={this.props.getComment}
        />
      </React.Fragment>
    )
  }
}

export default VariationPage
