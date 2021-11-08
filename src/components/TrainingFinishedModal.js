import React, { Component } from "react"
import "../styles/Modal.css"
import Translator from "./Translator"

let varis_str = ""

class TrainingFinishedModal extends Component {
/*
    constructor(props) {
        super(props)
        this.onDoneClick = this.onDoneClick.bind(this);
    }
    onDoneClick() {
        if (this.props.op_index) {
            this.props.history.push("/openings/" + this.props.op_index)
        } else {
            this.props.history.push("/")
        }
    }
*/
    render() {
        if(this.props.visible){
            const color = this.props.trainColor ? this.props.trainColor === "white" : undefined
            const varis = this.props.get_compatible_variations(
                this.props.json_moves, 
                this.props.op_index || color || null,
                this.props.trainGroup || this.props.vari_name || null,
                this.props.vari_subname || null,
            )
            varis_str = varis.map(v => `${v.op_name} ${v.vari_name} ${v.vari_subname}`).join(", ")
        }

        return (
            <div className={"modal" + (this.props.visible ? " modalVisible" : " modalHidden")} onClick={this.props.close}>
                <div className="modalContent" onClick={e => e.stopPropagation()}>
                    <div className="insideModal" onClick={e => e.stopPropagation()}>
                        <h2><Translator text="Congrats" /></h2>
                        <p><Translator text="You just trained on" />: <span className="impText">{varis_str}</span></p>
                        <div id="trainingFinishedIconContainer">
                            <div id="trainingFinishedIcon" className="iconText impText">emoji_events</div>
                        </div>
                    </div>
                    <div className="modalButtons">
                        <button className="simpleButton modalButton" onClick={() => {
                            this.props.done()
                            this.props.close()
                        }}>
                            <span className="iconText impText">done</span>
                        </button>
                        <button className="simpleButton modalBackButton"onClick={this.props.close}>
                            <span className="iconText">close</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TrainingFinishedModal
