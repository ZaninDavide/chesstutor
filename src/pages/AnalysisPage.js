import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"
import { FREE_PLAYING_MODE, AGAINST_STOCKFISH_MODE } from "../utilities/constants"

class TrainingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stockfish_plays: false,
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
      console.log(old.stockfish_plays)
      if (old.stockfish_plays) {
        return {
          playColor: "both",
          stockfish_plays: false
        }
      } else {
        return {
          playColor: this.props.match.params.color,
          stockfish_plays: true,
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
          key="analysisBoard"
          mode={this.state.stockfish_plays ? AGAINST_STOCKFISH_MODE : FREE_PLAYING_MODE}

          history={this.props.history}
          ops={this.props.ops}
          match={this.props.match}

          buttons={["more", "back", "forward_next"]}
          moreMenuButtons={["flip", "smallBoard"]}
          tabs={["book", "stockfish"]}

          rotation={color}
          playColor={this.state.playColor}
          allowCommentEdit={false}
          startMoves={this.props.match.params.moves}

          stockfish={{
            show_arrows: true,
            depth: this.state.stockfish_depth,
            auto_eval: this.state.stockfish_auto_eval,
            auto_best_move: this.state.stockfish_auto_best_move,
          }}
          switch_stockfish={this.switch_stockfish}
          switch_auto_eval={this.switch_auto_eval}
          switch_auto_best_move={this.switch_auto_best_move}
          set_stockfish_depth={depth => this.setState({ stockfish_depth: depth})}

          get_correct_moves_data_book={this.props.get_correct_moves_data_book}
          wait_time={this.props.wait_time}
          volume={this.props.volume}
        />
      </React.Fragment>
    )
  }
}

export default TrainingPage
