import React, { Component } from "react"
import CheckBox from "../components/CheckBox"
// import TrainingFinishedModal from "./TrainingFinishedModal"
import Translator from "../components/Translator"

class StockfishUI extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div id="boardDataStockfishSlide" key="boardDataStockfishSlide" className="boardDataSlide">
            <table id="stockfishTable">
                <tbody>
                    <tr>
                        <td><CheckBox text="Position evaluation" checked={this.props.stockfish.auto_eval} click={this.props.switch_auto_eval} /></td>
                        <td>
                            <button className="simpleButton" onClick={this.props.stockfish_evaluate}>
                                {this.props.stockfish_evaluation !== undefined ? this.props.stockfish_evaluation : "--"}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td><CheckBox text="Best move" checked={this.props.stockfish.auto_best_move} click={this.props.switch_auto_best_move} /></td>
                        <td><button className="simpleButton" onClick={this.props.stockfish_find_best_moves}>{this.props.stockfish_chosen_move || "--"}</button></td>
                    </tr>
                    <tr>
                        <td><CheckBox text="Play agains the computer" checked={this.props.stockfish.makes_moves} click={this.props.switch_stockfish} /></td>
                        <td></td>
                    </tr>
                    <tr style={{ lineHeight: "var(--uiElementSmallHeight)", height: "var(--uiElementSmallHeight)" }}>
                        <td>
                            <span id="depthLabel"><Translator text={"Precision (depth)"} /></span>&nbsp;
                            <input type="range" min="1" max="20" step="1" value={this.props.stockfish.depth} onChange={e => this.props.set_stockfish_depth(e.target.value)} />
                        </td>
                        <td style={{ textAlign: "center" }}>{this.props.stockfish.depth}</td>
                    </tr>
                </tbody>
            </table>

            {/*
            <h2>{"Stockfish settings:"}</h2>
            <CheckBox text={"Play against stockfish"} checked={this.props.stockfish.makes_moves} click={this.props.switch_stockfish} /><br />
            <CheckBox text={"Evaluate position"} checked={this.props.stockfish.auto_eval} click={() => { }} /><br />
            <CheckBox text={"Find best move"} checked={this.props.stockfish.auto_best_move} click={() => { }} /><br />

            <p>{"Depth: "}{this.props.stockfish.depth}</p>
            <button className="simpleButton" onClick={this.props.stockfish_find_best_moves}>BEST MOVE</button>
            <br />
            <button className="simpleButton" onClick={this.props.stockfish_evaluate}>EVALUATE {this.props.stockfish_evaluation}</button>
        */}

        </div>
    }
}

export default StockfishUI
