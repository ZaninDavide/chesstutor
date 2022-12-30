import React, { Component } from "react"
import Translator from "./Translator"

class SmartTrainingBox extends Component {
    render() {
        const GOAL = 300 // TODO
        let to_study = true
        let total = 0
        if(this.props.stats && this.props.stats[this.props.today_str]){
            const stats = this.props.stats[this.props.today_str]
            total = stats.white_moves + stats.black_moves;
            to_study = total < GOAL
        }
        let percentage = total / GOAL * 100
        return <div id="smartTrainingBox" key="smartTrainingBox">
            <div id="smartTrainingBoxInfo" >
                <h1><Translator text="Daily training" /></h1>
                {to_study ? null : <p>You have done all your training for today!</p>}
            </div>
            <div id="smartTrainingBoxButtons">
                {
                    to_study ?
                    <>
                        <button className="simpleButton impButton iconText" id="smartTrainingButton" 
                            onClick={() => this.props.history.push("/training/smart")}
                            >
                            school
                        </button><br />
                        <div style={{width: "100%", borderRadius: "2px", height: "4px", backgroundImage: `-webkit-linear-gradient(left, var(--main) 0%, var(--main) ${percentage}%, var(--onModalBack) ${percentage}%, var(--onModalBack) 100%)`}}></div>
                    </>
                    :
                        null
                }
            </div>
        </div>
    }
}

export default SmartTrainingBox
