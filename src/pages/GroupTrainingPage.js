import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"

class GroupTrainingPage extends Component {
  /*constructor(props) {
    super(props)
  }*/

  render() {
    const op_index = parseInt(this.props.match.params.op_index)
    const op = this.props.ops[op_index]

    const vari_name = this.props.match.params.vari_name

    console.log("vari_name", vari_name)

    console.log("op_index", op_index, op)

    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" goTo={"/openings/" + op_index} title={"Training ⋅ " + vari_name} />
        <Board
          key="colorTrainingBoard"
          history={this.props.history}

          trainGroup={vari_name}
          rotation={op.op_color}
          playColor={op.op_color}

          op_index={op_index}

          buttons={["back", "help", "more"]}
          is_move_allowed_group={this.props.is_move_allowed_group}
          get_pc_move_data_group={this.props.get_pc_move_data_group}
          get_correct_moves_data_group={this.props.get_correct_moves_data_group}
          getComment={this.props.getComment}
          allowCommentEdit={false}
          notify={this.props.notify}
          wait_time={this.props.wait_time}
        />
      </React.Fragment>
    )
  }
}

export default GroupTrainingPage
