import React, { Component } from "react"
import "../styles/Modal.css"
import Translator from "./Translator"

class TrainingFinishedModal extends Component {
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

    render() {
        return (
            <div className={"modal" + (this.props.visible ? " modalVisible" : " modalHidden")} onClick={this.props.close}>
                <div className="modalContent" onClick={e => e.stopPropagation()}>
                    <div className="insideModal" onClick={e => e.stopPropagation()}>
                        <h2><Translator text="Congrats" /></h2>
                        <div id="trainingFinishedIconContainer">
                            <div id="trainingFinishedIcon" className="iconText impText">emoji_events</div>
                        </div>
                    </div>
                    <div className="modalButtons">
                        <button className="simpleButton modalButton"
                            disabled={false}
                            onClick={() => {
                                this.onDoneClick()
                                this.props.close()
                            }}
                        ><span className="iconText">done</span></button>
                        <button className="simpleButton modalBackButton"
                            onClick={() => {
                                this.props.close()
                            }}
                        ><span className="iconText">close</span></button>
                    </div>
                </div>
            </div>
        )
    }
}

export default TrainingFinishedModal
