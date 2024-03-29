import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"
import { OPENING_TRAINING_MODE } from "../utilities/constants"

class TrainingPage extends Component {
  constructor(props) {
    super(props)

    if (props.ops.length < parseInt(props.match.params.op_index)) {
      console.log("TrainingPage: constructor: This opening do not exists.")
    }
  }

  render() {
    const op_index = parseInt(this.props.match.params.op_index)
    const op = this.props.ops[op_index]
    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" goTo={"/openings/" + op_index} title={<React.Fragment><Translator text={"Training"} />{": " + op.op_name}</React.Fragment>} />
        <Board
          key="trainingBoard"
          mode={OPENING_TRAINING_MODE}

          history={this.props.history}
          op_index={op_index}

          buttons={["back", "help", "more"]}
          moreMenuButtons={["Analyze", "flip", "smallBoard", "copy_pgn", "copy_fen"]}
          tabs={["moves"]}

          rotation={op.op_color}
          playColor={op.op_color}

          is_move_allowed={this.props.is_move_allowed}
          get_pc_move_data={this.props.get_pc_move_data}
          getComment={this.props.getComment}
          getDrawBoardPDF={this.props.getDrawBoardPDF}
          allowCommentEdit={false}
          get_correct_moves_data={this.props.get_correct_moves_data}
          get_compatible_variations={this.props.get_compatible_variations}
          notify={this.props.notify}
          settings={this.props.settings}
        />
      </React.Fragment>
    )
  }
}

export default TrainingPage
