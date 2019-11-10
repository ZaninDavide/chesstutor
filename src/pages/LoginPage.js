import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import "../styles/Pages.css"

class LoginPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: "asiago4",
      password: "formaggiomorbido",
      rememberMe: false,
    }
    this.checkBoxClick = this.checkBoxClick.bind(this)
    this.signUpClick = this.signUpClick.bind(this)
    this.loginClick = this.loginClick.bind(this)
  }

  login = async () => {
    const res = await fetch(
        "https://chesstutorserver.herokuapp.com/login",
        {
            body: JSON.stringify({
                email: this.state.username,
                password: this.state.password,
            }),
            headers: {
                "content-type": "application/json",
            },
            method: "POST",
        }
    ).then(res => res.text())

    this.props.setBearer(res)
  }

  signup = async () => {
      let res = await fetch(
          "https://chesstutorserver.herokuapp.com/signup",
          {
              body: JSON.stringify({
                  email: this.state.username,
                  password: this.state.password,
              }),
              headers: {
                  "content-type": "application/json",
              },
              method: "POST",
          }
      )
      const textRes = await res.text()

      if(res.status !== 200){
        if(textRes==="Weak password - Add another word or two. Uncommon words are better."){
          // di all'utente di mettere una password più forte
          console.log(textRes)
        }
        else{
          // crasha
          console.log("errore sconosciuto")
        }
      }else{
        this.props.setBearer(textRes)
      }

  }

  checkBoxClick(){
    this.setState(old => {return {
      rememberMe: !old.rememberMe
    }})
  }

  async signUpClick(){
    if(this.state.username !== "" & this.state.password !== ""){
      await this.signup()
      this.props.history.push("/home")
    }else{
      console.log("signUpClick: missing username or password")
    }
  }

  async loginClick(){
    if(this.state.username !== "" & this.state.password !== ""){
      await this.login()
      this.props.history.push("/home")
    }else{
      console.log("signUpClick: missing username or password")
    }
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
          <button onClick={this.signUpClick} className="importantButton" style={{position: "absolute", bottom: "calc(var(--uiElementHeight) + 2 * var(--mediumMargin))", marginBottom: 0, width: "calc(100% - 30px)"}}><Translator text={"Sign up"} /></button>
          <button onClick={this.loginClick} className="importantButton" style={{position: "absolute", bottom: "var(--mediumMargin)", marginBottom: 0, width: "calc(100% - 30px)"}}><Translator text={"Login"} /></button>
        </div>
      </React.Fragment>
    )
  }
}

export default LoginPage
