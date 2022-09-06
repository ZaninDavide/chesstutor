import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"
import { SMART_TRAINING_MODE } from "../utilities/constants"

class SmartTrainingPage extends Component {
  render() {
    const smart_training_target_vari = this.props.get_target_vari(this.props.targets_list)
    const target_vari_color = this.props.targets_list.length > 0 ? this.props.targets_list[0].vari_color : "none"
    const target_vari_op_index = this.props.targets_list.length > 0 ? this.props.targets_list[0].vari_op_index : null
    const target_vari_index = this.props.targets_list.length > 0 ? this.props.targets_list[0].vari_index : null
    const target_vari_name = smart_training_target_vari ? smart_training_target_vari.vari_name : null
    const target_vari_subname = smart_training_target_vari ? smart_training_target_vari.vari_subname : null

    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" goTo={"/"} title={<React.Fragment><Translator text={"Daily training"} /></React.Fragment>} />
        <Board
          key="smartTrainingBoard"
          mode={SMART_TRAINING_MODE}

          history={this.props.history}
          ops={this.props.ops}

          playColor={target_vari_color}
          rotation={target_vari_color}
          smart_training_target_vari={smart_training_target_vari}
          onSmartTrainingVariFinished={this.props.onSmartTrainingVariFinished}
          target_vari_op_index={target_vari_op_index}
          target_vari_index={target_vari_index}
          target_vari_color={target_vari_color}
          target_vari_name={target_vari_name}
          target_vari_subname={target_vari_subname}
          targets_list={this.props.targets_list}

          get_pc_move_data={this.props.get_pc_move_data}
          get_correct_moves_data={this.props.get_correct_moves_data}
          is_move_allowed={this.props.is_move_allowed}
          is_move_allowed_color={this.props.is_move_allowed_color}

          getComment={this.props.getComment}
          getDrawBoardPDF={this.props.getDrawBoardPDF}

          buttons={["back", "help", "more"]}
          moreMenuButtons={["Analyze", "flip", "smallBoard"]}
          tabs={["moves", "vari_info", "op_name"]}

          notify={this.props.notify}
          wait_time={this.props.wait_time}
          volume={this.props.volume}
        />
      </React.Fragment>
    )
  }
}

export default SmartTrainingPage
