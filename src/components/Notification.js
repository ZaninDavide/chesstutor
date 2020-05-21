import React, { Component } from "react"
// import Translator from "../components/Translator"

class Notification extends Component {
  /*constructor(props) {
    super(props)
  }*/

  render() {
    return (
        <div 
            id="notification" 
            className={
                (this.props.visible ? "notificationVisible" : "notificationHidden") +
                (this.props.type === "alert" ? " notificationAlert" : (this.props.type === "important" ? " notificationImp" : " notificationNormal"))
            }
            onClick={this.props.close}
        >
            {this.props.text}
        </div>
    )
  }
}

export default Notification
