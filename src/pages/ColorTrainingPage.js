import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"

class ColorTrainingPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const color = parseInt(this.props.match.params.color_number) === 0 ? "black" : "white"
    
    return (
      <React.Fragment>
        <Header mainButtonText="keyboard_backspace" goTo={"/"} title={<React.Fragment><Translator text={"Training"} />{": "}<Translator text={color} />{" "}<Translator text={"openings"} /></React.Fragment>} />
        <Board 
          key="colorTrainingBoard"
          history={this.props.history} 

          trainColor={color}
          rotation={color}
          playColor={color}

          buttons={["back", "help"]}
          is_move_allowed_color={this.props.is_move_allowed_color}
          get_pc_move_data_color={this.props.get_pc_move_data_color}
          get_correct_moves_data_color={this.props.get_correct_moves_data_color}
          getComment={this.props.getComment} 
          allowCommentEdit={false}
        />
      </React.Fragment>
    )
  }
}

export default ColorTrainingPage
