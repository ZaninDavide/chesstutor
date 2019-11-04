import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import "../styles/Pages.css"

class LoginPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: "",
      password: "",
      rememberMe: false,
    }
    this.checkBoxClick = this.checkBoxClick.bind(this)
  }

  checkBoxClick(){
    this.setState(old => {return {
      rememberMe: !old.rememberMe
    }})
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Login"} />} />
        <div id="loginPage" className="page">
          <div id="loginPageBody">
            <Translator text={"Username"} />:
            <input type="text" className="textBox" value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>
            <br/><br/>
            <Translator text={"Password"} />:
            <input type="password" className="textBox" value={this.state.password} onChange={e => this.setState({password: e.target.value})}/>
            <br/><br/>
            <div className="checkBoxContainer">
              <div className={"checkBox" + (this.state.rememberMe ? " checked" : "")}  onClick={this.checkBoxClick} />&nbsp;
              <Translator text={"Remember me"} />
            </div>
          </div>
          <button className="importantButton" style={{position: "absolute", bottom: "var(--mediumMargin)", marginBottom: 0, width: "calc(100% - 30px)"}}><Translator text={"Login"} /></button>
        </div>
      </React.Fragment>
    )
  }
}

export default LoginPage
