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
      stockfish_depth: 8,
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
          buttons={["more", "back", "forward_next"]}
          moreMenuButtons={["flip"]}
          rotation={color}
          playColor={this.state.playColor}
          allowCommentEdit={false}
          startMoves={this.props.match.params.moves}
          stockfish={{
            makes_moves: this.state.stockfish,
            show_arrows: true,
            depth: this.state.stockfish_depth,
            auto_eval: this.state.stockfish_auto_eval,
            auto_best_move: this.state.stockfish_auto_best_move,
          }}
          switch_stockfish={this.switch_stockfish}
          switch_auto_eval={this.switch_auto_eval}
          switch_auto_best_move={this.switch_auto_best_move}
          set_stockfish_depth={depth => this.setState({ stockfish_depth: depth})}
          wait_time={this.props.wait_time}
          volume={this.props.volume}
          get_correct_moves_data_book={this.props.get_correct_moves_data_book}
        />
      </React.Fragment>
    )
  }
}

export default TrainingPage
