import React, { Component } from "react"
import "../styles/Modal.css"

class VariationAddedModal extends Component {
    constructor(props) {
        super(props)
        this.getStyle = this.getStyle.bind(this);
        this.onDoneClick = this.onDoneClick.bind(this);
    }

    getStyle() {
        return {
            display: this.props.visible ? "block" : "none",
            backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
        }
    }

    onDoneClick() {
        this.props.history.push("/openings/" + this.props.op_index)
    }

    render() {
        return (
            <div className="modal" onClick={this.props.close} style={this.getStyle()}>
                <div className="modalContent" onClick={e => e.stopPropagation()}>
                    <div className="insideModal" onClick={e => e.stopPropagation()}>
                        <h2>
                            <span className="impText">
                                {this.props.added_vari_names.name + " " + this.props.added_vari_names.subname}
                            </span>{" "}was succesfully added to your repertoire!<br />
                        </h2>
                        <div id="goodJobIconContainer">
                            <div id="goodJobIcon" className="iconText impText">thumb_up_alt</div>
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

export default VariationAddedModal
