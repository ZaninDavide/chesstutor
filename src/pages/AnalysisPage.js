import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"

class TrainingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stockfish: false,
      stockfish_auto_eval: false,
      stockfish_auto_best_move: false,
      playColor: "both"
    }
    this.switch_stockfish = this.switch_stockfish.bind(this);
    this.switch_auto_eval = this.switch_auto_eval.bind(this);
    this.switch_auto_best_move = this.switch_auto_best_move.bind(this);
  }

  switch_stockfish(callback) {
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
    }, callback)
  }

  switch_auto_eval(callback) {
    this.setState(old => {
      return {
        stockfish_auto_eval: !old.stockfish_auto_eval
      }
    }, callback)
  }

  switch_auto_best_move(callback) {
    this.setState(old => {
      return {
        stockfish_auto_best_move: !old.stockfish_auto_best_move
      }
    }, callback)
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
            depth: 8,
            auto_eval: this.state.stockfish_auto_eval,
            auto_best_move: this.state.stockfish_auto_best_move,
          }}
          switch_stockfish={this.switch_stockfish}
          switch_auto_eval={this.switch_auto_eval}
          switch_auto_best_move={this.switch_auto_best_move}
        />
      </React.Fragment>
    )
  }
}

export default TrainingPage
