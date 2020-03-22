import React, { Component } from "react"
import Header from "../components/Header"
import OpItem from "../components/OpItem"
import Translator from "../components/Translator"
import HangingMenu from "../components/HangingMenu"
import Modal from "../components/Modal"
import SendModal from "../components/SendModal"

import generatePDF from "../generatePDF/generatePDF.js"

class OpsListPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      hMenuVisible: false,
      hMenuOpIndex: null,
      opDeleteVisible: false,
      opNewName: "",
      sendVisible: false,
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
  }

  getSeparator(text, goTo){
    return  <div id={"opsSeparator" + text} className="opsSeparator" key={"opsSeparator" + text} onClick={() => goTo ? this.props.history.push(goTo) : null}>
              <span className={text === "Archived openings" ? "alertText" : "impText"}>
                <Translator text={text} />
              </span>
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
        if(cur.archived){ // add item to archived
          archived.push(item)
        }else{ // add item to not_archived
          if(cur.op_color === "white"){
            not_archived_white.push(item)
          }else{
            not_archived_black.push(item)
          }
        }
        return true
      })
      // connect all together: not_archived_white + separator + not_archived_black + separator + archived
      let all = []
      if(not_archived_white.length > 0){
        all.push(this.getSeparator("White", "/training/fullcolor/1"))
        all = all.concat(not_archived_white)
      }
      if(not_archived_black.length > 0){
        all.push(this.getSeparator("Black", "/training/fullcolor/0"))
        all = all.concat(not_archived_black)
      }
      if(archived.length > 0){
        all.push(this.getSeparator("Archived openings"))
        all = all.concat(archived)
      }
      return all
    } else {
      return <p><Translator text={"no_openings"}/></p>
    }
  }

  newOpButton(){
    this.props.history.push("/newOpening")
  }

  hMenuClose(){
    this.setState({hMenuVisible: false})
  }

  hMenuOpen(op_index){
    this.setState({hMenuVisible: true, hMenuOpIndex: op_index})
  }

  closeOpDeleteModal(){
    this.setState({opDeleteVisible: false})
  }

  openOpDeleteModal(){
    this.setState({opDeleteVisible: true})
  }

  closeSendModal(){
    this.setState({sendVisible: false})
  }

  openSendModal(){
    this.setState({sendVisible: true})
  }

  renameThisOpening(){
    this.props.renameOp(this.state.hMenuOpIndex, this.state.opNewName)
  }

  printPDF(html){
    let content = document.getElementById("contentPDF")
    if(!content){
      content = document.createElement("div")
      content.id = "contentPDF"
      document.getElementById('App').before(content);
    }
    content.innerHTML = html
    window.print();
  }

  no_openings_style(len){
    if(len > 0) return {}
    return {
      background: `url("/files/no_openings.svg")`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center"
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Openings"}/>} goTo={"/profile"} mainButtonText="person"/>
        <div id="opsListPage" className={"page"} style={this.no_openings_style(this.props.ops.length)}>
          {this.getOpItems(this.props.ops)}
          <button id="newOpButton" className="roundButton iconButton impButton" onClick={this.newOpButton}>
            add
          </button>
        </div>
        <HangingMenu visible={this.state.hMenuVisible & this.props.ops.length > 0} close={this.hMenuClose}>
          {/* DELETE BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => {this.hMenuClose(); this.openOpDeleteModal();}}>
          <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon"><span className="alertText">delete</span></div>
              <div className="hMenuButtonLabel"><span className="alertText">Delete</span></div>
            </div>
          </button>
          {/* ARCHIVE BUTTON */}
          <button className="simpleButton hMenuButton" 
            onClick={() => {this.hMenuClose(); this.props.switchArchivedOpening(this.state.hMenuOpIndex);}}
          >
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">{(this.state.hMenuOpIndex !== null && this.props.ops[this.state.hMenuOpIndex] !== undefined) ? (this.props.ops[this.state.hMenuOpIndex].archived ? "unarchive" : "archive") : null}</div>
              <div className="hMenuButtonLabel">{(this.state.hMenuOpIndex !== null && this.props.ops[this.state.hMenuOpIndex] !== undefined) ? (this.props.ops[this.state.hMenuOpIndex].archived ? "Unarchive" : "Archive") : null}</div>
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
              <div className="hMenuButtonLabel">Print PDF</div>
            </div>
          </button>
          {/* SEND BUTTON */}
          <button className="simpleButton hMenuButton"
            onClick={() => {this.hMenuClose();  this.openSendModal();}}
          >
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">send</div>
              <div className="hMenuButtonLabel">Send</div>
            </div>
          </button>
          {/* EDIT BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => this.setState({renameOpVisible: true, opNewName: "", hMenuVisible: false})}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">edit</div>
              <div className="hMenuButtonLabel">Rename</div>
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
            { this.state.opDeleteVisible ? 
              <React.Fragment><h2><Translator text={"Delete permanently:"} />&nbsp;<span className="alertText">{this.props.ops[this.state.hMenuOpIndex].op_name}</span>{"?"}</h2></React.Fragment> : null
            }     
        </Modal>
        {/* SEND OP MODAL */}
        <SendModal 
          visible={this.state.sendVisible} 
          close={this.closeSendModal}
          hMenuOpIndex={this.state.hMenuOpIndex}
          op={this.props.ops[this.state.hMenuOpIndex]}
          op_index={this.state.hMenuOpIndex}
        />
        {/* RENAME OP MODAL */}
        <Modal 
          visible={this.state.renameOpVisible} 
          close={() => this.setState({renameOpVisible: false})} 
          onDoneClick={this.renameThisOpening} 
          disabledDoneButton={this.state.opNewName.length === 0}
        >
          { this.state.renameOpVisible ? 
            <React.Fragment>
              <h2><Translator text={"Rename"} />&nbsp;
              <span style={{color: "var(--impButtonBack)"}}>{this.props.ops[this.state.hMenuOpIndex].op_name}</span>&nbsp;
              <Translator text={"to:"} /></h2>
              <input type="text" 
                className="textBox renameTextBox"
                value={this.state.opNewName} 
                onChange={e => this.setState({opNewName: e.target.value})}
                onKeyPress={e => {
                  if (e.which === 13 || e.keyCode === 13) {
                    this.renameThisOpening()
                    this.setState({renameOpVisible: false})
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
