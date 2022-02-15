import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import Ripples from "react-ripples"
import TogglePanel from "../components/TogglePanel"

import { sound_move } from "../utilities/file_paths"

let move_audio

class userPage extends Component {
  constructor(props) {
    super(props)
    /*this.state = {
      tab: "profile"
    }*/
    this.acceptMail = this.acceptMail.bind(this)
    this.discardMail = this.discardMail.bind(this)

    move_audio = new Audio(sound_move)
  }

  acceptMail(mail, mail_id) {
    this.props.addOpening(mail)
    this.props.deleteMail(mail_id)
  }

  discardMail(mail_id) {
    this.props.deleteMail(mail_id)
  }

  click(mail, index) {
    this.acceptMail(mail, index)
    this.props.notify("Opening downloaded")
  }

  previewVolume(volume) {
    move_audio.volume = volume
    move_audio.play()
  }

  render() {
    if (!this.props.username) {
      this.props.history.push("/login")
    }

    const profilePage = () => <div id="profile" key="profile">
      <TogglePanel title="General" panelName="settingsGeneralPanel" startOpen>
        <div className="settingsSection">
          <Translator text="Language" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button className="simpleButton" onClick={() => this.props.setLanguage("eng")} style={{ marginRight: 0, color: this.props.language === "eng" ? "var(--main)" : "var(--text)" }}><Translator text={"ENG"} /></button></Ripples>
            <Ripples><button className="simpleButton" onClick={() => this.props.setLanguage("ita")} style={{ marginLeft: 0, color: this.props.language === "ita" ? "var(--main)" : "var(--text)" }}><Translator text={"ITA"} /></button></Ripples>
          </div>
        </div>
        <div className="settingsSection">
          <Translator text="Color theme" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button className="simpleButton" onClick={() => this.props.setTheme("darkTheme")} style={{ marginRight: 0, color: this.props.colorTheme === "darkTheme" ? "var(--main)" : "var(--text)" }}><Translator text={"Dark"} /></button></Ripples>
            <Ripples><button className="simpleButton" onClick={() => this.props.setTheme("lightTheme")} style={{ marginLeft: 0, color: this.props.colorTheme === "lightTheme" ? "var(--main)" : "var(--text)" }}><Translator text={"Light"} /></button></Ripples>
            <Ripples><button className="simpleButton" onClick={() => this.props.setTheme("autoTheme")} style={{ marginLeft: 0, color: this.props.colorTheme === "autoTheme" ? "var(--main)" : "var(--text)" }}><Translator text={"Auto"} /></button></Ripples>
          </div>
        </div>
        <div className="settingsSection">
          <Translator text="Volume" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button onClick={() => { this.props.setVolume(0.0); this.previewVolume(0.0) }} className="simpleButton" style={{ color: this.props.volume === 0.0 ? "var(--main)" : "var(--text)" }}><Translator text={"Off"}/></button></Ripples>
            <Ripples><button onClick={() => { this.props.setVolume(0.2); this.previewVolume(0.2) }} className="simpleButton" style={{ color: this.props.volume === 0.2 ? "var(--main)" : "var(--text)" }}><Translator text={"Low"}/></button></Ripples>
            <Ripples><button onClick={() => { this.props.setVolume(0.6); this.previewVolume(0.6) }} className="simpleButton" style={{ color: this.props.volume === 0.6 ? "var(--main)" : "var(--text)" }}><Translator text={"Medium"}/></button></Ripples>
            <Ripples><button onClick={() => { this.props.setVolume(1.0); this.previewVolume(1.0) }} className="simpleButton" style={{ color: this.props.volume === 1.0 ? "var(--main)" : "var(--text)" }}><Translator text={"High"}/></button></Ripples>
          </div>
        </div>
        <div className="settingsSection">
          <Translator text="Chess Notation" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button onClick={() => { this.props.setVisualChessNotation(true) }} className="simpleButton" style={{ fontFamily: "chess", color: this.props.visual_chess_notation ? "var(--main)" : "var(--text)" }}><Translator text={"Qa1"}/></button></Ripples>
            <Ripples><button onClick={() => { this.props.setVisualChessNotation(false) }} className="simpleButton" style={{ color: !this.props.visual_chess_notation ? "var(--main)" : "var(--text)" }}><Translator text={"Qa1"}/></button></Ripples>
          </div>
        </div>
      </TogglePanel>
      
      <TogglePanel title="Training" name="settingsTraingingPanel">
        <div className="settingsSection">
          <Translator text="Computer waits before moving (ms)" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button onClick={() => this.props.setWaitTime(0)} className="simpleButton" style={{ marginRight: 0, color: this.props.wait_time === 0 ? "var(--main)" : "var(--text)" }}>0</button></Ripples>
            <Ripples><button onClick={() => this.props.setWaitTime(250)} className="simpleButton" style={{ marginRight: 0, color: this.props.wait_time === 250 ? "var(--main)" : "var(--text)" }}>250</button></Ripples>
            <Ripples><button onClick={() => this.props.setWaitTime(500)} className="simpleButton" style={{ marginRight: 0, color: this.props.wait_time === 500 ? "var(--main)" : "var(--text)" }}>500</button></Ripples>
            <Ripples><button onClick={() => this.props.setWaitTime(1000)} className="simpleButton" style={{ marginLeft: 0, color: this.props.wait_time === 1000 ? "var(--main)" : "var(--text)" }}>1000</button></Ripples>
            <Ripples><button onClick={() => this.props.setWaitTime(2000)} className="simpleButton" style={{ marginLeft: 0, color: this.props.wait_time === 2000 ? "var(--main)" : "var(--text)" }}>2000</button></Ripples>
          </div>
        </div>
      </TogglePanel>
      
      <TogglePanel title="Profile" name="settingsProfilePanel">
        <div className="settingsSection">
          <button
            onClick={this.props.downloadDatabase}
            id="downloadDataBaseButton" className="simpleButton"
          ><Translator text="Download database" /></button>
        </div>
        <div className="settingsSection">
          <button
            onClick={this.props.logout}
            id="logoutButton" className="simpleButton"
          ><Translator text="Log out" /></button>
        </div>
      </TogglePanel>
    </div>

    return (
      <React.Fragment>
        <Header title={this.props.username} mainButtonText="arrow_back" />
        <div id="userPage" className="page">

          {profilePage()}
          {/*

            {this.state.tab === "inbox" ? inboxPage() : profilePage()}

            <div id="userPageTabContainer">
            <Ripples
              className={"userPageTab" + (this.state.tab === "profile" ? " userPageTabSelected" : "")}
              onClick={() => this.setState({ tab: "profile" })}
            >
              <span className="iconText">account_box</span>
            </Ripples>
            <Ripples
              className={"userPageTab" + (this.state.tab === "inbox" ? " userPageTabSelected" : "")}
              onClick={() => this.setState({ tab: "inbox" })}
            >
              <span className="iconText">mail</span>
            </Ripples>
          </div>
          */}
        </div>
      </React.Fragment>
    )
  }
}

export default userPage
