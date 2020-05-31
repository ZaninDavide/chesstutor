import React, { Component } from "react"
import Translator from "./Translator"

class Notification extends Component {
  render() {
    return (
        <div 
            id="notification" 
            className={
                (this.props.visible ? "notificationVisible" : "notificationHidden") +
                (this.props.type === "error" ? " notificationError" : (this.props.type === "important" ? " notificationImp" : " notificationNormal"))
            }
            onClick={this.props.close}
        >
            <Translator text={this.props.text} />
        </div>
    )
  }
}

export default Notification
