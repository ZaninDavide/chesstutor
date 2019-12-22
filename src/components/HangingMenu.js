import React, { Component } from "react"
import "../styles/Modal.css"

class HangingMenu extends Component {
  getStyle(){
    return {
      marginBottom: this.props.visible ? 0 : -100,
    }
  }

  getBackStyle(){
    return {
      display: this.props.visible ? "initial" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, .4)" : "rgba(0, 0, 0, 0)",
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="hMenuBack" onClick={this.props.close} style={this.getBackStyle()}/>
        <div className="hMenuContent" style={this.getStyle()}>
          {this.props.children}
        </div>
      </React.Fragment>
    )
  }
}

export default HangingMenu
