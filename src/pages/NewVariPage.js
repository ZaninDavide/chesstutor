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
        <Header mainButtonText="arrow_back" goTo={"/openings/" + op_index} title={<React.Fragment>{op.op_name}{" ⋅ "}<Translator text={"New variation"} /></React.Fragment>} />
        <Board 
          history={this.props.history} 
          createVari={this.props.createVari} 
          op_index={op_index} 
          buttons={["back", "done", "multi_next"]}
          rotation={op.op_color}
          playColor={"both"}
          editComment={this.props.editComment}
          setDrawBoardPDF={this.props.setDrawBoardPDF}
          getDrawBoardPDF={this.props.getDrawBoardPDF}
          getComment={this.props.getComment}
          allowCommentEdit={true}
          get_correct_moves_data={this.props.get_correct_moves_data}
          getOpFreeSubnames={this.props.getOpFreeSubnames}
          notify={this.props.notify}
        />
      </React.Fragment>
    )
  }
}

export default VariationPage
