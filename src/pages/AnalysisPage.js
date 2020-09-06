import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"

class TrainingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stockfish: false,
      playColor: "both"
    }
    this.switchStockfish = this.switchStockfish.bind(this);
  }

  switchStockfish() {
    this.setState(old => {
      if (old.stockfish) {
        return {
          playColor: "both",
          stockfish: false
        }
      } else {
        return {
          playColor: this.props.match.params.color,
          stockfish: true,
        }
      }
    })
  }

  render() {
    const color = this.props.match.params.color
    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" title={<Translator text={"Analysis"} />} />
        <Board
          history={this.props.history}
          buttons={["back", "forward_next"]}
          rotation={color}
          playColor={this.state.playColor}
          allowCommentEdit={false}
          startMoves={this.props.match.params.moves}
          stockfish={{
            makes_moves: this.state.stockfish,
            show_arrows: true,
            depth: 5,
          }}
          switchStockfish={this.switchStockfish}
        />
      </React.Fragment>
    )
  }
}

export default TrainingPage
