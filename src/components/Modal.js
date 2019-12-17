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
          {this.props.children}
          <div className="modalButtons">
            <button className="modalButton simpleButton" 
              onClick={() => {
                this.props.onDoneClick()
                this.props.close()
              }}
            >done</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Modal
