import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"
import { NEW_VARI_MODE } from "../utilities/constants"

class NewVariPage extends Component {
  constructor(props) {
    super(props)

    if (props.ops.length < props.match.params.op_index) {
      console.log("VariationPage: constructor: This opening do not exists.")
    }
  }

  render() {
    const op_index = parseInt(this.props.match.params.op_index)
    const op = this.props.ops[op_index]
    const vari_name = this.props.match.params.vari_name
    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" goTo={"/openings/" + op_index} title={<React.Fragment>{op.op_name + " ⋅ " + vari_name + " ⋅ "}<Translator text={"New variation"} /></React.Fragment>} />
        <Board
          key="newVariBoard"
          mode={NEW_VARI_MODE}
          history={this.props.history}
          
          op_index={op_index}
          vari_name={vari_name}
          
          buttons={["back", "done", "multi_next", "more", "add_comment"]}
          moreMenuButtons={["flip", "load_variations", "smallBoard"]}
          tabs={["moves"]}

          rotation={op.op_color}
          playColor={"both"}

          createVari={this.props.createVari}
          editComment={this.props.editComment}
          setDrawBoardPDF={this.props.setDrawBoardPDF}
          getDrawBoardPDF={this.props.getDrawBoardPDF}
          getComment={this.props.getComment}
          allowCommentEdit={true}
          get_correct_moves_data={this.props.get_correct_moves_data}
          getOpFreeSubnames={this.props.getOpFreeSubnames}
          notify={this.props.notify}
          wait_time={this.props.wait_time}
          volume={this.props.volume}
        />
      </React.Fragment>
    )
  }
}

export default NewVariPage
