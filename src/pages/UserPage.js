import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import Ripples from "react-ripples"

class userPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: "profile"
    }
    this.acceptMail = this.acceptMail.bind(this)
    this.discardMail = this.discardMail.bind(this)
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

  render() {
    if (!this.props.username) {
      this.props.history.push("/login")
    }

    const profilePage = () => <div id="profile" key="profile">
      <h3 className="profilePageTitle"><Translator text="GENERAL" /></h3>
      <div className="settingsSection">
        <Translator text="Language" />:&nbsp;
        <Ripples><button className="simpleButton" onClick={() => this.props.setLanguage("eng")} style={{ marginRight: 0, color: this.props.language === "eng" ? "var(--main)" : "var(--text)" }}><Translator text={"ENG"} /></button></Ripples>
        <Ripples><button className="simpleButton" onClick={() => this.props.setLanguage("ita")} style={{ marginLeft: 0, color: this.props.language === "ita" ? "var(--main)" : "var(--text)" }}><Translator text={"ITA"} /></button></Ripples>
      </div>
      <div className="settingsSection">
        <Translator text="Color theme" />:&nbsp;
        <Ripples><button className="simpleButton" onClick={() => this.props.setTheme("darkTheme")} style={{ marginRight: 0, color: this.props.colorTheme === "darkTheme" ? "var(--main)" : "var(--text)" }}><Translator text={"Dark"} /></button></Ripples>
        <Ripples><button className="simpleButton" onClick={() => this.props.setTheme("lightTheme")} style={{ marginLeft: 0, color: this.props.colorTheme === "lightTheme" ? "var(--main)" : "var(--text)" }}><Translator text={"Light"} /></button></Ripples>
      </div>

      {/*<h3 className="profilePageTitle"><Translator text="BOARD"/></h3>*/}

      <button
        onClick={this.props.logout}
        id="logoutButton"
        className="barButton"
      ><Translator text="Log out" /></button>
    </div>

    const inboxPage = () => this.props.inbox.length === 0 ? <div id="emptyInbox" /> : <div id="mailItemContainer">
      {this.props.inbox.map((mail, index) =>
        <div className="mailItem" onClick={() => this.click(mail, index)} key={"mailItem_" + index + "_" + mail.op_name + "_" + mail.creator_email}>
          <div className="mailItemLeft">
            <h2>{mail.op_name}</h2>
            <p>{mail.creator_email}</p>
          </div>
          <div className="mailItemRight">
            <button className="iconButton mailItemCloseButton"
              onClick={e => {
                e.stopPropagation()
                this.discardMail(index)
              }}
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>

    return (
      <React.Fragment>
        <Header title={this.props.username} mainButtonText="arrow_back" />
        <div id="userPage" className="page">

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
        </div>
      </React.Fragment>
    )
  }
}

export default userPage
