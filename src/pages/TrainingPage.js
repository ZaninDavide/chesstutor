import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"

class TrainingPage extends Component {
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
        <Header mainButtonText="arrow_back" goTo={"/openings/" + op_index} title={<React.Fragment><Translator text={"Training"} />{": " + op.op_name}</React.Fragment>} />
        <Board 
          key="trainingBoard"
          history={this.props.history} 
          op_index={op_index}
          buttons={["back", "help", "more"]}
          is_move_allowed={this.props.is_move_allowed}
          get_pc_move_data={this.props.get_pc_move_data}
          rotation={op.op_color}
          playColor={op.op_color}
          getComment={this.props.getComment}
          allowCommentEdit={false}
          get_correct_moves_data={this.props.get_correct_moves_data}
          setDrawBoardPDF={this.props.setDrawBoardPDF}
          getDrawBoardPDF={this.props.getDrawBoardPDF}
          notify={this.props.notify}
        />
      </React.Fragment>
    )
  }
}

export default TrainingPage
