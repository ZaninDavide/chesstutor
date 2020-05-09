import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"

class userPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      tab: "profile"
    }
    this.acceptMail = this.acceptMail.bind(this)
    this.discardMail = this.discardMail.bind(this)
  }

  acceptMail(mail, mail_id){
    this.props.addOpening(mail)
    this.props.deleteMail(mail_id)
  }

  discardMail(mail_id){
    this.props.deleteMail(mail_id)
  }

  render() {
    if(!this.props.username){
      this.props.history.push("/login")
    }

    const profilePage = () => <>
      <p><Translator text="Name"/>:&nbsp;{this.props.username}</p>
      <p><Translator text="Language"/>:&nbsp;{this.props.language}</p>
      <button 
        onClick={this.props.logout}
        id="logoutButton" 
        className="barButton"
      ><Translator text="Log out"/></button>
    </>

    const inboxPage = () => <>
      {this.props.inbox.map((mail, index) => 
        <div className="mailItem">
          <div className="mailItemLeft">
            <h2>{mail.op_name}</h2>
            <p>{mail.creator_email}</p>
          </div> 
          <div className="mailItemRight">
            <button className="iconButton mailItemButton mailItemCloseButton" onClick={() => this.discardMail(index)}>
              close
            </button>
            <button className="iconButton mailItemButton mailItemOpenButton" onClick={() => this.acceptMail(mail, index)}>
              done
            </button>
          </div>
        </div>
      )}
    </>

    return (
      <React.Fragment>
        <Header title={this.props.username} />
        <div id="userPage" className="page">
          <div id="userPageTabContainer">
            <div 
              className={"userPageTab" + (this.state.tab === "profile" ? " userPageTabSelected" : "")}
              onClick={() => this.setState({tab: "profile"})}
            >
              <Translator text={"Profile"} />
            </div>
            <div 
              className={"userPageTab" + (this.state.tab === "inbox" ? " userPageTabSelected" : "")}
              onClick={() => this.setState({tab: "inbox"})}
            >
              <Translator text={"Inbox"} />
            </div>
          </div>
          {this.state.tab === "inbox" ? inboxPage() : profilePage()}
        </div>
      </React.Fragment>
    )
  }
}

export default userPage
