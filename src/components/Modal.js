import React, { Component } from "react"
import "../styles/Modal.css"

class Modal extends Component {
  render() {
    return (
      <div 
        className={"modal" + (this.props.visible ? " modalVisible" : " modalHidden")}
        onClick={this.props.close} 
      >
        <div 
          className="modalContent"
          onClick={e => e.stopPropagation()}
        >
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

export default Modal
