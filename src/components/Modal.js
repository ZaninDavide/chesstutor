import React, { Component } from "react"
import "../styles/Modal.css"

class Modal extends Component {
  constructor(props) {
    super(props)
    this.getStyle = this.getStyle.bind(this);
  }

  getStyle(){
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
    }
  }

  render() {
    return (
      <div className="modal" onClick={this.props.close} style={this.getStyle()}>
        <div className="modalContent" onClick={e => e.stopPropagation()}>
          <div className="insideModal" onClick={e => e.stopPropagation()}>
            {this.props.children} 
          </div>
          <div className="modalButtons">
            <button className="simpleButton modalButton"
              disabled={this.props.disabledDoneButton}
              onClick={() => {
                  this.props.onDoneClick()
                  this.props.close()
              }}
            >{this.props.doneButtonText ? this.props.doneButtonText : <span className="iconText">done</span>}</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal
