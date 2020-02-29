import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"

class LoginPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: "",
      password: "",
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
    )

    if(await res.status !== 200){
      // gestisci errore
      alert(await res.text())
      return false
    }else{
      let bearer = await res.text()
      this.props.setBearer(bearer)
      if(this.state.rememberMe){
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

      if(res.status !== 200){
        if(textRes==="Weak password - Add another word or two. Uncommon words are better."){
          // di all'utente di mettere una password più forte
          console.log(textRes)
        }
        else{
          // crasha
          console.log("errore sconosciuto")
        }
        alert(textRes)
        return false
      }else{
        this.props.setBearer(textRes)
        return true
      }

  }

  checkBoxClick(){
    this.setState(old => {return {
      rememberMe: !old.rememberMe
    }})
  }

  async signUpClick(){
    if(this.state.username !== "" & this.state.password !== ""){
      let signup_res = await this.signup()
      if(signup_res){
        // this.props.history.push("/")
        this.loginClick()
      }
    }else{
      console.log("signUpClick: missing username or password")
    }
  }

  async loginClick(){
    if(this.state.username !== "" & this.state.password !== ""){
      await this.login() // let login_res = 
      /*if(login_res){
        this.props.history.push("/")
      }*/
    }else{
      console.log("loginClick: missing username or password")
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Login"}/>}  goTo="/login" />
        <div id="loginPage" className="page">
          <div id="loginPageBody">
            <Translator text={"Username"} />:
            <input type="text" className="textBox" value={this.state.username} onChange={e => this.setState({username: e.target.value})}/>
            <br/><br/>
            <Translator text={"Password"} />:
            <input 
              type="password" className="textBox" 
              value={this.state.password} 
              onChange={e => this.setState({password: e.target.value})}
              onKeyPress={e => {
                if (e.which === 13 || e.keyCode === 13) {
                  this.loginClick()
                }
              }}
            />
            <br/><br/>
            <div className="checkBoxContainer">
              <span onClick={this.checkBoxClick} style={{display: "flex"}} >
                <div className={"checkBox" + (this.state.rememberMe ? " checked" : "")}/>
                &nbsp;
                <Translator text={"Remember me"}/>
              </span>
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
