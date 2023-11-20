import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"
import { SMART_TRAINING_MODE } from "../utilities/constants"

class SmartTrainingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      target_vari: this.props.get_target_vari(this.props.match.params.color),
    }
  }
  render() {
    const color = this.props.match.params.color
    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" goTo={"/"} title={<React.Fragment><Translator text={"Daily training"} /></React.Fragment>} />
        <Board
          key="smartTrainingBoard"
          mode={SMART_TRAINING_MODE}

          history={this.props.history}
          ops={this.props.ops}

          playColor={this.state.target_vari.op_color}
          rotation={this.state.target_vari.op_color}
          onSmartTrainingVariFinished={(op_index, vari_index, first_error, resetBoard_callback) => (
            this.props.onSmartTrainingVariFinished(op_index, vari_index, first_error, () => {
              let tv = this.props.get_target_vari(color);
              this.setState({target_vari: tv}, () => resetBoard_callback(tv.op_color));
              // console.log(this.state.target_vari)
            })
          )}
          target_vari={this.state.target_vari}

          get_pc_move_data={this.props.get_pc_move_data}
          get_correct_moves_data={this.props.get_correct_moves_data}
          is_move_allowed={this.props.is_move_allowed}
          is_move_allowed_color={this.props.is_move_allowed_color}

          getComment={this.props.getComment}
          getDrawBoardPDF={this.props.getDrawBoardPDF}

          buttons={["back", "help", "more"]}
          moreMenuButtons={["Analyze", "flip", "smallBoard", "copy_pgn", "copy_fen"]}
          tabs={["moves", "vari_info", "op_name", "goal_bar"]}

          notify={this.props.notify}
          settings={this.props.settings}
          stats={this.props.stats}
          today_str={this.props.today_str}
        />
      </React.Fragment>
    )
  }
}

export default SmartTrainingPage
