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
            <Ripples><button className="simpleButton" onClick={() => this.props.setLanguage("eng")} style={{ marginRight: 0, color: this.props.language === "eng" ? "var(--main)" : "var(--text)" }}>ENG</button></Ripples>
            <Ripples><button className="simpleButton" onClick={() => this.props.setLanguage("ita")} style={{ marginLeft: 0, color: this.props.language === "ita" ? "var(--main)" : "var(--text)" }}>ITA</button></Ripples>
          </div>
        </div>
        <div className="settingsSection">
          <Translator text="Color theme" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button className="simpleButton" onClick={() => this.props.setTheme("darkTheme")} style={{ marginRight: 0, color: this.props.settings.colorTheme === "darkTheme" ? "var(--main)" : "var(--text)" }}><Translator text={"Dark"} /></button></Ripples>
            <Ripples><button className="simpleButton" onClick={() => this.props.setTheme("lightTheme")} style={{ marginLeft: 0, color: this.props.settings.colorTheme === "lightTheme" ? "var(--main)" : "var(--text)" }}><Translator text={"Light"} /></button></Ripples>
            <Ripples><button className="simpleButton" onClick={() => this.props.setTheme("autoTheme")} style={{ marginLeft: 0, color: this.props.settings.colorTheme === "autoTheme" ? "var(--main)" : "var(--text)" }}><Translator text={"Auto"} /></button></Ripples>
          </div>
        </div>
        <div className="settingsSection">
          <Translator text="Volume" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button onClick={() => { this.props.setVolume(0.0); this.previewVolume(0.0) }} className="simpleButton" style={{ color: this.props.settings.volume === 0.0 ? "var(--main)" : "var(--text)" }}><Translator text={"Off"}/></button></Ripples>
            <Ripples><button onClick={() => { this.props.setVolume(0.2); this.previewVolume(0.2) }} className="simpleButton" style={{ color: this.props.settings.volume === 0.2 ? "var(--main)" : "var(--text)" }}><Translator text={"Low"}/></button></Ripples>
            <Ripples><button onClick={() => { this.props.setVolume(0.6); this.previewVolume(0.6) }} className="simpleButton" style={{ color: this.props.settings.volume === 0.6 ? "var(--main)" : "var(--text)" }}><Translator text={"Medium"}/></button></Ripples>
            <Ripples><button onClick={() => { this.props.setVolume(1.0); this.previewVolume(1.0) }} className="simpleButton" style={{ color: this.props.settings.volume === 1.0 ? "var(--main)" : "var(--text)" }}><Translator text={"High"}/></button></Ripples>
          </div>
        </div>
        <div className="settingsSection">
          <Translator text="Chess Notation" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button onClick={() => { this.props.setVisualChessNotation(true) }} className="simpleButton" style={{ fontFamily: "chess", color: this.props.settings.visual_chess_notation ? "var(--main)" : "var(--text)" }}>Qa1</button></Ripples>
            <Ripples><button onClick={() => { this.props.setVisualChessNotation(false) }} className="simpleButton" style={{ color: !this.props.settings.visual_chess_notation ? "var(--main)" : "var(--text)" }}>Qa1</button></Ripples>
          </div>
        </div>
      </TogglePanel>
      
      <TogglePanel title="Training" name="settingsTraingingPanel" startOpen>
        <div className="settingsSection">
          <Translator text="Targeted daily effort" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button onClick={() => this.props.setSetting("moves_goal", 0)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.moves_goal === 0 ? "var(--main)" : "var(--text)" }}>{"0 "}<Translator text="moves"/></button></Ripples>
            <Ripples><button onClick={() => this.props.setSetting("moves_goal", 200)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.moves_goal === 200 ? "var(--main)" : "var(--text)" }}>{"100 "}<Translator text="moves"/></button></Ripples>
            <Ripples><button onClick={() => this.props.setSetting("moves_goal", 600)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.moves_goal === 600 ? "var(--main)" : "var(--text)" }}>{"300 "}<Translator text="moves"/></button></Ripples>
            <Ripples><button onClick={() => this.props.setSetting("moves_goal", 1000)} className="simpleButton" style={{ marginLeft: 0, color: this.props.settings.moves_goal === 1000 ? "var(--main)" : "var(--text)" }}>{"500 "}<Translator text="moves"/></button></Ripples>
          </div>
        </div>
        <div className="settingsSection">
          <Translator text="Review depth" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button onClick={() => this.props.setSetting("depth_goal", 6)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.depth_goal === 6 ? "var(--main)" : "var(--text)" }}>{"3 "}<Translator text="moves"/></button></Ripples>
            <Ripples><button onClick={() => this.props.setSetting("depth_goal", 12)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.depth_goal === 12 ? "var(--main)" : "var(--text)" }}>{"6 "}<Translator text="moves"/></button></Ripples>
            <Ripples><button onClick={() => this.props.setSetting("depth_goal", 18)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.depth_goal === 18 ? "var(--main)" : "var(--text)" }}>{"9 "}<Translator text="moves"/></button></Ripples>
            <Ripples><button onClick={() => this.props.setSetting("depth_goal", 24)} className="simpleButton" style={{ marginLeft: 0, color: this.props.settings.depth_goal === 24 ? "var(--main)" : "var(--text)" }}>{"12 "}<Translator text="moves"/></button></Ripples>
            <Ripples><button onClick={() => this.props.setSetting("depth_goal", 999)} className="simpleButton" style={{ marginLeft: 0, color: this.props.settings.depth_goal === 999 ? "var(--main)" : "var(--text)" }}><Translator text="all moves"/></button></Ripples>
          </div>
        </div>
        <div className="settingsSection"> 
          <Translator text="Computer waits before moving" />:&nbsp;
          <div className="optionButtonsContainer">
            <Ripples><button onClick={() => this.props.setWaitTime(0)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.wait_time === 0 ? "var(--main)" : "var(--text)" }}>0ms</button></Ripples>
            <Ripples><button onClick={() => this.props.setWaitTime(250)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.wait_time === 250 ? "var(--main)" : "var(--text)" }}>250ms</button></Ripples>
            <Ripples><button onClick={() => this.props.setWaitTime(500)} className="simpleButton" style={{ marginRight: 0, color: this.props.settings.wait_time === 500 ? "var(--main)" : "var(--text)" }}>500ms</button></Ripples>
            <Ripples><button onClick={() => this.props.setWaitTime(1000)} className="simpleButton" style={{ marginLeft: 0, color: this.props.settings.wait_time === 1000 ? "var(--main)" : "var(--text)" }}>1000ms</button></Ripples>
            <Ripples><button onClick={() => this.props.setWaitTime(2000)} className="simpleButton" style={{ marginLeft: 0, color: this.props.settings.wait_time === 2000 ? "var(--main)" : "var(--text)" }}>2000ms</button></Ripples>
          </div>
        </div>
      </TogglePanel>
      
      <TogglePanel title="Advanced" name="settingsAdvancedPanel">
        <div className="settingsSection">
          <button
            onClick={this.props.downloadDatabase}
            id="downloadDatabaseButton" className="simpleButton"
          ><Translator text="Download database" /></button>
        </div>
      </TogglePanel>
      <div style={{textAlign: "center", paddingBottom: "150px"}}>
      <button
        onClick={this.props.logout}
        id="logoutButton"
        className="barButton alertButton"
        ><Translator text="Log out" /></button>
      </div>
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
