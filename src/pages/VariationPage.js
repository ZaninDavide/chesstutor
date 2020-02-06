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
        <Header mainButtonText="keyboard_backspace" goTo={"/openings/" + op_index} title={<React.Fragment>{op.op_name + ": " + vari.vari_name}</React.Fragment>} />
        <Board 
          history={this.props.history} 
          op_index={op_index} 
          vari_index={vari_index} 
          buttons={["back", "next"]}
          rotation={op.op_color}
          playColor={"none"}
          editComment={this.props.editComment}
          getComment={this.props.getComment}
          allowCommentEdit={true}
          get_vari_next_move_data={this.props.get_vari_next_move_data}
        />
      </React.Fragment>
    )
  }
}

export default VariationPage
