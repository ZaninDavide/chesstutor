import React, { Component } from "react"
import Header from "../components/Header"
import OpItem from "../components/OpItem"
import Translator from "../components/Translator"
import HangingMenu from "../components/HangingMenu"
import Modal from "../components/Modal"

class OpsListPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      hMenuVisible: false,
      hMenuOpIndex: null,
      opDeleteVisible: false,
      opNewName: "",
    }
    this.getOpItems = this.getOpItems.bind(this)
    this.newOpButton = this.newOpButton.bind(this)
    this.hMenuClose = this.hMenuClose.bind(this)
    this.hMenuOpen = this.hMenuOpen.bind(this)
    this.closeOpDeleteModal = this.closeOpDeleteModal.bind(this)
    this.openOpDeleteModal = this.openOpDeleteModal.bind(this)
    this.renameThisOpening = this.renameThisOpening.bind(this)
  }

  getArchivedSeparator(){
    return <div id="archivedOpsSeparator" key="archivedOpsSeparator"/>
  }

  getOpItems(ops) {
    if (ops.length > 0) {
      let not_archived = []
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
          not_archived.push(item)
        }
        return true
      })
      // connect all together: not_archived + separator + archived
      let all = not_archived
      if(archived.length > 0){
        all.push(this.getArchivedSeparator())
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

  renameThisOpening(){
    this.props.renameOp(this.state.hMenuOpIndex, this.state.opNewName)
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Openings"}/>} goTo={"/"}/>
        <div id="opsListPage" className="page">
          {this.getOpItems(this.props.ops)}
          <button id="newOpButton" className="importantButton iconButton" onClick={this.newOpButton}>
            add
          </button>
        </div>
        <HangingMenu visible={this.state.hMenuVisible} close={this.hMenuClose}>
          {/* EDIT BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => this.setState({renameOpVisible: true, opNewName: "", hMenuVisible: false})}>
            edit
          </button> 
          {/* STATS BUTTON */}
          <button className="simpleButton hMenuButton">
            emoji_events 
          </button> 
          {/* SHARE BUTTON */}
          <button className="simpleButton hMenuButton">
            share
          </button>
          {/* ARCHIVE BUTTON */}
          <button className="simpleButton hMenuButton" 
            onClick={() => {this.hMenuClose(); this.props.switchArchivedOpening(this.state.hMenuOpIndex);}}
          >
            {this.state.hMenuOpIndex !== null ? (this.props.ops[this.state.hMenuOpIndex].archived ? "unarchive" : "archive") : null}
          </button> 
          {/* DELETE BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => {this.hMenuClose(); this.openOpDeleteModal();}}>
            <span style={{color: "var(--alertColor)"}}>delete</span>
          </button>
        </HangingMenu>
        {/* DELETE OP MODAL */}
        <Modal 
          id="deleteOpModal" 
          visible={this.state.opDeleteVisible} 
          close={this.closeOpDeleteModal}
          doneButtonText={<span className="alertText">delete</span>}
          onDoneClick={() => this.props.deleteOpening(this.state.hMenuOpIndex)}>
            { this.state.opDeleteVisible ? 
              <React.Fragment><h2><Translator text={"Delete permanently:"} />&nbsp;<span className="alertText">{this.props.ops[this.state.hMenuOpIndex].op_name}</span>{"?"}</h2></React.Fragment> : null
            }     
        </Modal>
        {/* RENAME OP MODAL */}
        <Modal 
          visible={this.state.renameOpVisible} 
          close={() => this.setState({renameOpVisible: false})} 
          onDoneClick={this.renameThisOpening} 
          disabledDoneButton={this.state.opNewName.length === 0}
        >
          { this.state.renameOpVisible ? 
            <React.Fragment>
              <Translator text={"Rename "} />
              <span style={{color: "var(--importantButtonBackColor)"}}>{this.props.ops[this.state.hMenuOpIndex].op_name}</span>
              <Translator text={" to: "} />
              <input type="text" 
                className="textBox"
                value={this.state.opNewName} 
                onChange={e => this.setState({opNewName: e.target.value})}
                onKeyPress={e => {
                  if (e.which === 13 || e.keyCode === 13) {
                    this.renameThisOpening()
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
