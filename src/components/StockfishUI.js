import React, { Component } from "react"
import CheckBox from "../components/CheckBox"
// import TrainingFinishedModal from "./TrainingFinishedModal"
import Translator from "../components/Translator"
import Ripples from "react-ripples"

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
                                {(() => {
                                    if(this.props.stockfish_evaluation === undefined){
                                        return "-"
                                    }else if(isNaN(this.props.stockfish_evaluation)){
                                        return "#"
                                    }else{
                                        return this.props.stockfish_evaluation
                                    }
                                })()}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td><CheckBox text="Best move" checked={this.props.stockfish.auto_best_move} click={this.props.switch_auto_best_move} /></td>
                        <td><button className="simpleButton" onClick={this.props.stockfish_find_best_moves}>{this.props.stockfish_chosen_move || "-"}</button></td>
                    </tr>
                    <tr>
                        <td><CheckBox text="Play agains the computer" checked={this.props.stockfish.makes_moves} click={this.props.switch_stockfish} /></td>
                        <td></td>
                    </tr>
                    <tr style={{ lineHeight: "var(--uiElementSmallHeight)", height: "var(--uiElementSmallHeight)" }}>
                        <td>
                            <span id="depthLabel"><Translator text={"Precision (depth)"} /></span>&nbsp;
                            <div className="optionButtonsContainer">
                                <Ripples><button onClick={() => this.props.set_stockfish_depth(8)} className="simpleButton" style={{ marginRight: 0, color: this.props.stockfish.depth === 8 ? "var(--main)" : "var(--text)" }}>FAST</button></Ripples>
                                <Ripples><button onClick={() => this.props.set_stockfish_depth(12)} className="simpleButton" style={{ marginRight: 0, color: this.props.stockfish.depth === 12 ? "var(--main)" : "var(--text)" }}>GOOD</button></Ripples>
                                <Ripples><button onClick={() => this.props.set_stockfish_depth(16)} className="simpleButton" style={{ marginRight: 0, color: this.props.stockfish.depth === 16 ? "var(--main)" : "var(--text)" }}>PRECISE</button></Ripples>
                                <Ripples><button onClick={() => this.props.set_stockfish_depth(20)} className="simpleButton" style={{ marginLeft: 0, color: this.props.stockfish.depth === 20 ? "var(--main)" : "var(--text)" }}>ACCURATE</button></Ripples>
                                <Ripples><button onClick={() => this.props.set_stockfish_depth(28)} className="simpleButton" style={{ marginLeft: 0, color: this.props.stockfish.depth === 28 ? "var(--main)" : "var(--text)" }}>DEEPER</button></Ripples>
                            </div>
                        </td>
                        <td style={{ textAlign: "center" }}>{this.props.stockfish.depth}</td>
                    </tr>
                </tbody>
            </table>
            
            <br/>
            <a href={"https://lichess.org/analysis/standard/" + this.props.get_fen()} target="_blank">
                <button className="simpleButton"><Translator text={"Open on lichess.org"} /></button>
            </a>
            <a href={"https://www.chess.com/analysis?fen=" + this.props.get_fen()} target="_blank">
                <button className="simpleButton"><Translator text={"Open on chess.com"} /></button>
            </a>

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
