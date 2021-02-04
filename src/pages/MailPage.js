import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"

class mailPage extends Component {
  constructor(props) {
    super(props)
    this.acceptMail = this.acceptMail.bind(this)
    this.discardMail = this.discardMail.bind(this)
  }

  componentDidMount(){
    this.props.updateInbox()
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
        <Header title={<Translator text="Messages" />} mainButtonText="arrow_back" />
        <div id="mailPage" className="page">
          {inboxPage()}
        </div>
      </React.Fragment>
    )
  }
}

export default mailPage
