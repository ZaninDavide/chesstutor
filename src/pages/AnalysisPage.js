import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"

class TrainingPage extends Component {
  /*constructor(props) {
    super(props)
  }*/

  render() {
    const color = this.props.match.params.color
    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" title={<Translator text={"Analysis"} />} />
        <Board
          history={this.props.history}
          buttons={["back", "forward_next"]}
          rotation={color}
          playColor={"both"}
          allowCommentEdit={false}
          startFen={this.props.match.params.fen}
        />
      </React.Fragment>
    )
  }
}

export default TrainingPage
