import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import Modal from "../components/Modal"
import {process_comment} from "../utilities/san_parsing"

class mailPage extends Component {
  constructor(props) {
    super(props)
    this.state = { messageToDiscardIndex: -1 }
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
        <div className="mailItem" key={"mailItem_" + index + "_" + mail.op_name + "_" + mail.creator_email}>
          <div className="mailItemLeft">
            <h2>{mail.op_name}</h2>
            <p className="mailFrom">{mail.creator_email}</p>
            {
              mail.comments["|"] ? [<hr className="mailParagraphHr" />, <p 
                className="mailParagraph" 
                dangerouslySetInnerHTML={{__html: process_comment(mail.comments["|"])}}>  
              </p>] : null
            }
          </div>
          <div className="mailItemRight">
            <button className="iconButton mailItemAddButton"
              onClick={e => {
                e.stopPropagation()
                this.click(mail, index)
              }}
            >
              add
            </button>
            <button className="iconButton mailItemCloseButton"
              onClick={e => {
                e.stopPropagation()
                this.setState({messageToDiscardIndex: index})
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
        <Modal 
          visible={this.state.messageToDiscardIndex !== -1} 
          onDoneClick={() => {
            this.discardMail(this.state.messageToDiscardIndex)
          }}
          close={() => this.setState({messageToDiscardIndex: -1})}
          doneButtonText={<span className="iconText alertText">delete</span>}
        >
          <h2><Translator text={"discard_mail"} /></h2>
        </Modal>
      </React.Fragment>
    )
  }
}

export default mailPage
