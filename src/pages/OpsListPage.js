import React, { Component } from "react"
import Header from "../components/Header"
import OpItem from "../components/OpItem"
import Translator from "../components/Translator"
import HangingMenu from "../components/HangingMenu"
import Modal from "../components/Modal"
import SendModal from "../components/SendModal"
import SmartTrainingBox from "../components/SmartTrainingBox"

import generatePDF from "../generatePDF/generatePDF.js"

import { Menu, MenuItem } from '@szhsin/react-menu';

class OpsListPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hMenuVisible: false,
      hMenuOpIndex: null,
      opDeleteVisible: false,
      opNewName: "",
      sendVisible: false,
      archiveVisible: false
    }
    this.getOpItems = this.getOpItems.bind(this)
    this.newOpButton = this.newOpButton.bind(this)
    this.hMenuClose = this.hMenuClose.bind(this)
    this.hMenuOpen = this.hMenuOpen.bind(this)
    this.closeOpDeleteModal = this.closeOpDeleteModal.bind(this)
    this.openOpDeleteModal = this.openOpDeleteModal.bind(this)
    this.renameThisOpening = this.renameThisOpening.bind(this)
    this.no_openings_style = this.no_openings_style.bind(this)
    this.closeSendModal = this.closeSendModal.bind(this)
    this.openSendModal = this.openSendModal.bind(this)
    this.getArchiveSeparator = this.getArchiveSeparator.bind(this)
  }

  getSeparator(text, name) {
    return <div id={"opsSeparator" + name} className="opsSeparator" key={"opsSeparator" + name}>
      <h3>
        <Translator text={text} />
      </h3>
    </div>
  }

  getArchiveSeparator(text, name) {
    return <div 
      id={"opsSeparator" + name} 
      className="opsSeparator" 
      key={"opsSeparator" + name} 
      onClick={() => this.setState(old => {return {archiveVisible: !old.archiveVisible}})}
    >
      <h3>
        <div
          id="archive_chevron" 
          style={{"textTransform": "none"}} 
          className={"iconText" + (this.state.archiveVisible ? " archive_chevron_rotated" : "")}
        >chevron_right</div>
        <Translator text={text} />
      </h3>
    </div>
  }

  getOpItems(ops) {
    if (ops.length > 0) {
      let not_archived_white = []
      let not_archived_black = []
      let archived = []
      // populate not_archived and archived
      ops.map((cur, index) => {
        let item = <OpItem
          op={cur}
          op_index={index}
          history={this.props.history}
          key={`opItem_${index}`}
          hMenuOpen={this.hMenuOpen}
        />
        if (cur.archived) { // add item to archived
          archived.push(item)
        } else { // add item to not_archived
          if (cur.op_color === "white") {
            not_archived_white.push(item)
          } else {
            not_archived_black.push(item)
          }
        }
        return true
      })
      // connect all together: not_archived_white + separator + not_archived_black + separator + archived
      let all = []
      if (not_archived_white.length > 0) {
        all.push(this.getSeparator("white", "White"))
        all = all.concat(not_archived_white)
      }
      if (not_archived_black.length > 0) {
        all.push(this.getSeparator("black", "Black"))
        all = all.concat(not_archived_black)
      }
      if (archived.length > 0) {
        all.push(this.getArchiveSeparator("Archived openings", "ArchivedOpenings"))
        let open_or_closed = this.state.archiveVisible ? "archiveVisible" : "archiveClosed"
        all = all.concat([<div id="archive" key="archive" className={open_or_closed}>{archived}</div>])
      }
      return all
    } else {
      return <p><Translator text={"no_openings"} /></p>
    }
  }

  newOpButton() {
    this.props.history.push("/newOpening")
  }

  hMenuClose() {
    this.setState({ hMenuVisible: false })
  }

  hMenuOpen(op_index) {
    this.setState({ hMenuVisible: true, hMenuOpIndex: op_index })
  }

  closeOpDeleteModal() {
    this.setState({ opDeleteVisible: false })
  }

  openOpDeleteModal() {
    this.setState({ opDeleteVisible: true })
  }

  closeSendModal() {
    this.setState({ sendVisible: false })
  }

  openSendModal() {
    this.setState({ sendVisible: true })
  }

  renameThisOpening() {
    this.props.renameOp(this.state.hMenuOpIndex, this.state.opNewName)
  }

  printPDF(html) {
    let content = document.getElementById("contentPDF")
    if (!content) {
      content = document.createElement("div")
      content.id = "contentPDF"
      document.getElementById('App').before(content);
    }
    content.innerHTML = html
    window.print();
  }

  no_openings_style(len) {
    if (len > 0) return {}
    return {
      background: `url("/files/no_openings.svg")`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center"
    }
  }

  render() {
  const hmenu_op_name = this.state.hMenuOpIndex !== null ? (this.props.ops[this.state.hMenuOpIndex] ? this.props.ops[this.state.hMenuOpIndex].op_name : undefined) : undefined

    return (
      <React.Fragment>
        <Header
          title={<Translator text={"Openings"} />}
          headerMenu={
            <Menu menuButton={
              <button id="headerButton" className="iconButton">menu</button>}>
              {/*<MenuItem onClick={() => this.props.history.push("/training/options")}><Translator text="Training" /></MenuItem>*/}
              <MenuItem onClick={() => this.props.history.push("/analysis/white/normal/book/[]")}><Translator text="Free analysis" /></MenuItem>
              <MenuItem onClick={() => this.props.history.push("/mail")}><Translator text="Messages" /></MenuItem>
              <MenuItem onClick={() => this.props.history.push("/profile")}><Translator text="Settings" /></MenuItem>
            </Menu>
          }
        />
        <div id="opsListPage" className={"page"} style={this.no_openings_style(this.props.ops.length)}>
          {
            this.props.ops.length > 0 ? 
              <SmartTrainingBox 
                stats={this.props.stats} 
                today_str={this.props.today_str} 
                history={this.props.history} 
                settings={this.props.settings}
                user_over_all_score={this.props.user_over_all_score}
              />
            : null
          }
          
          {this.getOpItems(this.props.ops)}
          <button id="newOpButton" className="roundButton iconButton impButton" onClick={this.newOpButton}>
            add
          </button>
        </div>

        {/* ---------------------------- MODALS ---------------------------- */}

        <HangingMenu 
          visible={this.state.hMenuVisible & this.props.ops.length > 0} 
          close={this.hMenuClose}
          title={hmenu_op_name}
        >
          {/* DELETE BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => { this.hMenuClose(); this.openOpDeleteModal(); }}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon"><span className="alertText">delete</span></div>
              <div className="hMenuButtonLabel"><span className="alertText"><Translator text="Delete" /></span></div>
            </div>
          </button>
          {/* ARCHIVE BUTTON */}
          <button className="simpleButton hMenuButton"
            onClick={() => { this.hMenuClose(); this.props.switchArchivedOpening(this.state.hMenuOpIndex); }}
          >
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">{(this.state.hMenuOpIndex !== null && this.props.ops[this.state.hMenuOpIndex] !== undefined) ? (this.props.ops[this.state.hMenuOpIndex].archived ? "unarchive" : "archive") : null}</div>
              <div className="hMenuButtonLabel"><Translator text={(this.state.hMenuOpIndex !== null && this.props.ops[this.state.hMenuOpIndex] !== undefined) ? (this.props.ops[this.state.hMenuOpIndex].archived ? "Unarchive" : "Archive") : null} /></div>
            </div>
          </button>
          {/* STATS BUTTON */}
          {/*<button className="simpleButton hMenuButton">emoji_events</button>*/}
          {/* PRINT BUTTON */}
          <button
            className="simpleButton hMenuButton"
            onClick={() => {
              this.hMenuClose();
              this.printPDF(generatePDF(this.props.ops[this.state.hMenuOpIndex]))
            }}
          >
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">print</div>
              <div className="hMenuButtonLabel"><Translator text="Print PDF" /></div>
            </div>
          </button>
          {/* SEND BUTTON */}
          <button className="simpleButton hMenuButton"
            onClick={() => { this.hMenuClose(); this.openSendModal(); }}
          >
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">send</div>
              <div className="hMenuButtonLabel"><Translator text="Send" /></div>
            </div>
          </button>
          {/* EDIT BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => this.setState({ renameOpVisible: true, opNewName: "", hMenuVisible: false })}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">edit</div>
              <div className="hMenuButtonLabel"><Translator text="Rename" /></div>
            </div>
          </button>
          {/* BOOK BUTTON */}
          <button className="simpleButton hMenuButton" 
            onClick={() => this.props.history.push(`/openings/${this.state.hMenuOpIndex}/${this.props.ops[this.state.hMenuOpIndex].op_color}/book/[]`)}
          >
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">menu_book</div>
              <div className="hMenuButtonLabel"><Translator text="Book" /></div>
            </div>
          </button>
        </HangingMenu>
        {/* DELETE OP MODAL */}
        <Modal
          id="deleteOpModal"
          visible={this.state.opDeleteVisible}
          close={this.closeOpDeleteModal}
          doneButtonText={<span className="alertText iconText">delete</span>}
          onDoneClick={() => this.props.deleteOpening(this.state.hMenuOpIndex)}>
          {this.state.opDeleteVisible ?
            <React.Fragment><h2><Translator text={"Delete permanently:"} />&nbsp;<span className="alertText">{hmenu_op_name}</span>{"?"}</h2></React.Fragment> : null
          }
        </Modal>
        {/* SEND OP MODAL */}
        <SendModal
          visible={this.state.sendVisible}
          close={this.closeSendModal}
          hMenuOpIndex={this.state.hMenuOpIndex}
          op={this.props.ops[this.state.hMenuOpIndex]}
          op_index={this.state.hMenuOpIndex}
          sendOpening={this.props.sendOpening}
        />
        {/* RENAME OP MODAL */}
        <Modal
          visible={this.state.renameOpVisible}
          close={() => this.setState({ renameOpVisible: false })}
          onDoneClick={this.renameThisOpening}
          disabledDoneButton={this.state.opNewName.length === 0}
        >
          {this.state.renameOpVisible ?
            <React.Fragment>
              <h2><Translator text={"Rename"} />&nbsp;
              <span style={{ color: "var(--main)" }}>{hmenu_op_name}</span>&nbsp;
              <Translator text={"to:"} /></h2>
              <input type="text"
                className="textBox renameTextBox"
                value={this.state.opNewName}
                onChange={e => this.setState({ opNewName: e.target.value })}
                onKeyPress={e => {
                  if (e.which === 13 || e.keyCode === 13) {
                    this.renameThisOpening()
                    this.setState({ renameOpVisible: false })
                  }
                }}
              />
            </React.Fragment> : null
          }
        </Modal>
      </React.Fragment>
    )
  }
}

export default OpsListPage
