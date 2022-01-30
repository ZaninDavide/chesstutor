import React, { Component } from "react"
import CheckBox from "../components/CheckBox"
// import TrainingFinishedModal from "./TrainingFinishedModal"
import Translator from "../components/Translator"
import Ripples from "react-ripples"
import { AGAINST_STOCKFISH_MODE } from "../utilities/constants"
import TogglePanel from "./TogglePanel"

class StockfishUI extends Component {
    render() {
        return <div id="boardDataStockfishSlide" key="boardDataStockfishSlide" className="boardDataSlide">
            <table id="stockfishTable">
                <tbody>
                    <tr>
                        <td><CheckBox text={<Translator text={"Show position evaluation"} />} checked={this.props.stockfish.show_eval} click={this.props.stockfish_switch_show_eval}/></td>
                        <td>
                            <button className="simpleButton">
                                {this.props.stockfish.show_eval ? this.props.stockfish.eval : null}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <CheckBox 
                                text={<Translator text={"Show best move"} />} 
                                checked={this.props.stockfish.show_best} 
                                click={this.props.stockfish_switch_show_best}
                            />
                        </td>
                        <td>
                            <button className="simpleButton">
                                {this.props.stockfish.show_best ? this.props.stockfish.best : null}
                            </button>
                        </td>
                    </tr>
                    <tr style={{"display": this.props.stockfish.show_eval || this.props.stockfish.show_best ? "revert" : "none"}}>
                        <td>
                            <CheckBox
                                text={<Translator text={"In-cloud analisys"} />} 
                                checked={this.props.stockfish.use_lichess_cloud} 
                                click={this.props.stockfish_switch_use_lichess_cloud}
                            />
                        </td>
                        <td></td>
                    </tr>
                    <tr style={{ lineHeight: "var(--uiElementSmallHeight)", height: "var(--uiElementSmallHeight)" }}>
                        <td>
                            <span id="depthLabel"><Translator text={"Precision (depth)"} /></span>&nbsp;
                            <div className="optionButtonsContainer">
                                <Ripples><button onClick={() => this.props.stockfish_set_depth(8)} className="simpleButton" style={{ marginRight: 0, color: this.props.stockfish.depth === 8 ? "var(--main)" : "var(--text)" }}>8</button></Ripples>
                                <Ripples><button onClick={() => this.props.stockfish_set_depth(12)} className="simpleButton" style={{ marginRight: 0, color: this.props.stockfish.depth === 12 ? "var(--main)" : "var(--text)" }}>12</button></Ripples>
                                <Ripples><button onClick={() => this.props.stockfish_set_depth(16)} className="simpleButton" style={{ marginRight: 0, color: this.props.stockfish.depth === 16 ? "var(--main)" : "var(--text)" }}>16</button></Ripples>
                                <Ripples><button onClick={() => this.props.stockfish_set_depth(20)} className="simpleButton" style={{ marginLeft: 0, color: this.props.stockfish.depth === 20 ? "var(--main)" : "var(--text)" }}>20</button></Ripples>
                                <Ripples><button onClick={() => this.props.stockfish_set_depth(28)} className="simpleButton" style={{ marginLeft: 0, color: this.props.stockfish.depth === 28 ? "var(--main)" : "var(--text)" }}>28</button></Ripples>
                            </div>
                        </td>
                        <td style={{ textAlign: "center" }}>{this.props.stockfish.depth}</td>
                    </tr>
                </tbody>
            </table>
            <TogglePanel title="Extra" panelName="stockfishExtraPanel">
                <a href={"https://lichess.org/analysis/standard/" + this.props.get_fen()} target="_blank">
                    <button className="simpleButton"><Translator text={"Open on lichess.org"} /></button>
                </a>
                <a href={"https://www.chess.com/analysis?fen=" + this.props.get_fen()} target="_blank">
                    <button className="simpleButton"><Translator text={"Open on chess.com"} /></button>
                </a>
            </TogglePanel>
        </div>
    }
}

export default StockfishUI
