import React, { Component } from "react"
import "../styles/Modal.css"

class HangingMenu extends Component {

  render() {
    return (
      <div 
        className={"hMenu " + (this.props.visible ? " menuVisible" : " menuHidden")}
        onClick={this.props.close} 
      >
        <div 
          className="hMenuContent"
          onClick={e => e.stopPropagation()}
        >
          <div className="hMenuHeader" onClick={this.props.close}>
            <h3>{this.props.title}</h3>
          </div>
          <div className="hMenuInside" onClick={e => e.stopPropagation()}>
            {this.props.children} 
          </div>
        </div>
      </div>
    )
  }

}

export default HangingMenu
