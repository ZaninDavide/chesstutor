import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"

class userPage extends Component {
  /*constructor(props){
    super(props)
  }*/

  render() {
    if(!this.props.username){
      this.props.history.push("/login")
    }
    return (
      <React.Fragment>
        <Header title={this.props.username} />
        <div id="userPage" className="page">
          <p><Translator text="Name"/>:&nbsp;{this.props.username}</p>
          <p><Translator text="Language"/>:&nbsp;{this.props.language}</p>
          <button 
            onClick={this.props.logout}
            id="logoutButton" 
            className="barButton"
          ><Translator text="Log out"/></button>
        </div>
      </React.Fragment>
    )
  }
}

export default userPage
