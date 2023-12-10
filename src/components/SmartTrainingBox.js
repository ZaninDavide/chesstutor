import React, { Component } from "react"
import Translator from "./Translator"


class SmartTrainingBox extends Component {

    // TODO: SHOULD CHECK IF ANY OPENING EXISTS AT ALL
    render() {
        let total = 0
        if(this.props.stats && this.props.stats[this.props.today_str]){
            const stats = this.props.stats[this.props.today_str]
            total = stats.white_moves + stats.black_moves;
        }
        let percentage = total / this.props.settings.moves_goal * 100
        return <div id="smartTrainingBox" key="smartTrainingBox">
            <div id="smartTrainingBoxInfo" >
                <h1><Translator text="Daily training" /></h1>
                {
                    this.props.settings.moves_goal !== 0 ?
                    <div style={{marginTop: "var(--mediumMargin)", width: "100%", borderRadius: "2px", height: "4px", backgroundImage: `-webkit-linear-gradient(left, var(--main) 0%, var(--main) ${percentage}%, var(--onModalBack) ${percentage}%, var(--onModalBack) 100%)`}}></div>
                    : null
                }
            </div>
            <div id="smartTrainingBoxButtons">
                <button className="simpleButton smartTrainingButton impButton" onClick={() => this.props.history.push("/training/smart/white")}>
                    <div className="simpleButton smartTrainingButtonContent">
                        <div>school</div>
                        <div><Translator text="White" /></div>
                    </div>
                </button>
                <div></div>
                <button className="simpleButton smartTrainingButton impButton" onClick={() => this.props.history.push("/training/smart/black")}>
                    <div className="simpleButton smartTrainingButtonContent">
                        <div>school</div>
                        <div><Translator text="Black" /></div>
                    </div>
                </button>                
            </div>
            <div id="smartTrainingBoxTotalScore" onClick={() => this.props.history.push("/stats")}>
                <div></div>
                <div>{this.props.user_over_all_score().total_score_str}</div>
                <div><Translator text="Current score"/></div>
            </div>
        </div>
    }
}

export default SmartTrainingBox
