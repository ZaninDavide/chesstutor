import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import { SPECTATOR_MODE, VARI_TRAINING_MODE } from "../utilities/constants"

class VariationPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      in_training: false,
    }
    if (props.ops.length < props.match.params.op_index) {
      console.log("VariationPage: constructor: This opening do not exists.")
    }
  }

  render() {
    const op_index = parseInt(this.props.match.params.op_index)
    const op = this.props.ops[op_index]
    const vari_index = this.props.match.params.vari_index
    const vari = op.variations[vari_index]
    const in_training = this.state.in_training
    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" goTo={"/openings/" + op_index} title={<React.Fragment>{op.op_name + " ⋅ " + vari.vari_name + " " + (vari.vari_subname || "")}</React.Fragment>} />
        <Board
          key="variationBoard"
          mode={in_training ? VARI_TRAINING_MODE : SPECTATOR_MODE}
          
          history={this.props.history}
          op_index={op_index}
          vari_index={vari_index}
          vari_name={vari.vari_name}
          vari_subname={vari.vari_subname}

          buttons={in_training ? ["back", "help", "stopTrainThis", "more"] : ["back", "single_next", "trainThis", "more", "add_comment"]}
          moreMenuButtons={["Analyze", "flip", "smallBoard"]}
          tabs={["moves", "vari_info"]}

          rotation={op.op_color}
          playColor={in_training ? op.op_color : "none"}
          allowCommentEdit={!in_training}

          editComment={this.props.editComment}
          setDrawBoardPDF={this.props.setDrawBoardPDF}
          getDrawBoardPDF={this.props.getDrawBoardPDF}
          getComment={this.props.getComment}
          get_vari_next_move_data={this.props.get_vari_next_move_data}
          get_pc_move_data={this.props.get_pc_move_data}
          is_move_allowed={this.props.is_move_allowed}
          get_correct_moves_data={this.props.get_correct_moves_data}
          get_compatible_variations={this.props.get_compatible_variations}
          notify={this.props.notify}

          set_in_training={(bool, callback = () => {}) => {
            this.setState({ in_training: bool }, () => callback(op.op_color))
            return op.op_color
          }}

          settings={this.props.settings}
        />
      </React.Fragment>
    )
  }
}

export default VariationPage
