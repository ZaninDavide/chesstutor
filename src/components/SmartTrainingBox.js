import React, { Component } from "react"
import Translator from "./Translator"

class SmartTrainingBox extends Component {
    render() {
        const to_study = this.props.targets_list.length
        return <div id="smartTrainingBox" key="smartTrainingBox">
            <div id="smartTrainingBoxInfo" >
                <h1><Translator text="Daily training" /></h1>
                <p><Translator text="Lines to revise today" />{": " + to_study}</p>
            </div>
            <div id="smartTrainingBoxButtons">
                {
                    to_study > 0 ?
                        <button className="simpleButton impButton iconText" id="smartTrainingButton" 
                            onClick={() => this.props.history.push("/training/smart")}
                        >
                            school
                        </button>
                    :
                        null
                }
            </div>
        </div>
    }
}

export default SmartTrainingBox
