import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import Ripples from "react-ripples"
import { Link } from "react-router-dom"

const SERVER_URI = "https://chessup.baida.dev:3008" // "http://localhost:6543" "https://chesstutorserver.herokuapp.com" "http://localhost:5000"

class SignupPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "",
      password: "",
      password2: "",
      rememberMe: false,
      signupWaiting: false,
    }
    this.checkBoxClick = this.checkBoxClick.bind(this)
    this.signUpClick = this.signUpClick.bind(this)
    this.loginClick = this.loginClick.bind(this)
  }

  login = async () => {
    const res = await fetch(
      SERVER_URI + "/login",
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
      SERVER_URI + "/signup",
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

  async signUpClick() {
    if (this.state.username !== "" & this.state.password !== "" & this.state.password2 !== "") {
      if (this.state.password === this.state.password2) {
        if (this.state.username.indexOf(",") === -1) {
          this.setState({signupWaiting: true})
          let signup_res = await this.signup()
          if (signup_res) {
            // this.props.history.push("/")
            this.loginClick()
          }
        } else {
          this.props.notify("Username cannot contain commas (',').", "error")
        }
      } else {
        this.props.notify("The fields 'password' and 'password repeated' do not match.", "error")
      }
    } else {
      this.props.notify("Fill all fields please.")
    }
    this.setState({signupWaiting: false})
  }

  async loginClick() {
    if (this.state.username !== "" & this.state.password !== "") {
      await this.login() // let login_res = 
      /*if(login_res){
        this.props.history.push("/")
      }*/
    } else {
      this.props.notify("Fill both username and password please.")
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Sign up"} />} goTo="/login" mainButtonText="arrow_back" />
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
            /><br /><br />
            <h2 className="loginPageLabel"><Translator text={"Repeat password"} />:</h2>
            <input
              type="password" className="textBox"
              value={this.state.password2}
              onChange={e => this.setState({ password2: e.target.value })}
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
            <span>{"If you already have an account "}<Link to="/login" id="loginLink">log in</Link>{" instead!"}</span>
          </div>
          <button onClick={this.signUpClick} disabled={this.state.signupWaiting} className="barButton impButton" style={{ position: "absolute", bottom: "var(--mediumMargin)", marginBottom: 0, width: "calc(100% - 30px)" }}><Translator text={"Sign up"} /></button>
        </div>
      </React.Fragment>
    )
  }
}

export default SignupPage
