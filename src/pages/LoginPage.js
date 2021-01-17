import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import Ripples from "react-ripples"
import { Link } from "react-router-dom"

class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      rememberMe: false,
      loginWaiting: false,
    }
    this.checkBoxClick = this.checkBoxClick.bind(this)
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
    )

    if (await res.status !== 200) {
      // gestisci errore
      this.props.notify(await res.text(), "error")
      return false
    } else {
      let bearer = await res.text()
      this.props.showLoadingScreen()
      this.props.setBearer(bearer)
      if (this.state.rememberMe) {
        this.props.rememberMeLocally(this.state.username, bearer)
      }
      return true
    }
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

    if (res.status !== 200) {
      if (textRes === "Weak password - Add another word or two. Uncommon words are better.") {
        // di all'utente di mettere una password più forte
        console.log("Weak password - Add another word or two. Uncommon words are better.")
      }
      else {
        // crasha
        console.log("errore sconosciuto")
      }
      this.props.notify(textRes.replace("email", "username"), "error")
      return false
    } else {
      this.props.showLoadingScreen()
      this.props.setBearer(textRes)
      return true
    }

  }

  checkBoxClick() {
    this.setState(old => {
      return {
        rememberMe: !old.rememberMe
      }
    })
  }

  async loginClick() {
    if (this.state.username !== "" & this.state.password !== "") {
      this.setState({loginWaiting: true})
      await this.login() // let login_res = 
      /*if(login_res){
        this.props.history.push("/")
      }*/
      this.setState({loginWaiting: false})
    } else {
      this.props.notify("Fill both username and password please.")
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Login"} />} goTo="/login" />
        <div id="loginPage" className="page">
          <div id="loginPageBody">
            <h2 className="loginPageLabel"><Translator text={"Username"} />:</h2>
            <input type="text" className="textBox" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} />
            <br /><br />
            <h2 className="loginPageLabel"><Translator text={"Password"} />:</h2>
            <input
              type="password" className="textBox"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
              onKeyPress={e => {
                if (e.which === 13 || e.keyCode === 13) {
                  this.loginClick()
                }
              }}
            />
            <br /><br />
            <Ripples className="checkBoxContainer">
              <span onClick={this.checkBoxClick} style={{ display: "flex" }} >
                <div className={"checkBox"}>
                  {this.state.rememberMe ? "check_box" : "check_box_outline_blank"}
                </div>
                &nbsp;
                <Translator text={"Remember me"} />
              </span>
            </Ripples>
            <br />
            <br />
            <span>{"If you don't have an account yet just "}<Link to="/signup" id="signupLink">sign up</Link>{" instead!"}</span>
          </div>
          <button onClick={this.loginClick} disabled={this.state.loginWaiting} className="barButton impButton" style={{ position: "absolute", bottom: "var(--mediumMargin)", marginBottom: 0, width: "calc(100% - 30px)" }}>
              <Translator text={"Login"} />
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default LoginPage
