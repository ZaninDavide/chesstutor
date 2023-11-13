import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"
import { COLOR_TRAINING_MODE } from "../utilities/constants"

class ColorTrainingPage extends Component {
  /*constructor(props) {
    super(props)
  }*/

  render() {
    const color = parseInt(this.props.match.params.color_number) === 0 ? "black" : "white"

    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" goTo={"/"} title={<React.Fragment><Translator text={"Training"} />{": "}<Translator text={color + " openings"} /></React.Fragment>} />
        <Board
          key="colorTrainingBoard"
          mode={COLOR_TRAINING_MODE}
          history={this.props.history}

          trainColor={color}
          rotation={color}
          playColor={color}

          buttons={["back", "help", "more"]}
          moreMenuButtons={["Analyze", "flip", "smallBoard", "copy_png", "copy_fen"]}
          tabs={["moves"]}

          is_move_allowed_color={this.props.is_move_allowed_color}
          get_pc_move_data_color={this.props.get_pc_move_data_color}
          get_correct_moves_data_color={this.props.get_correct_moves_data_color}
          get_compatible_variations={this.props.get_compatible_variations}
          getComment={this.props.getComment}
          getDrawBoardPDF={this.props.getDrawBoardPDF}
          allowCommentEdit={false}
          notify={this.props.notify}
          play_training_finished_sound={this.props.play_training_finished_sound}
          settings={this.props.settings}
        />
      </React.Fragment>
    )
  }
}

export default ColorTrainingPage
