import React, { Component } from "react"
import Header from "../components/Header"
import VariItem from "../components/VariItem"
import Translator from "../components/Translator"
import HangingMenu from "../components/HangingMenu"
import Modal from "../components/Modal"

import no_variations_svg from "../files/no_variations.svg"

class OpeningPage extends Component {
  constructor(props) {
    super(props)
    if (props.ops.length < props.match.params.op_index) {
      console.log("OpeningPage: constructor: This opening do not exists.")
    }
    this.state = {
      hMenuVisible: false,
      hMenuVariIndex: null,
      variDeleteVisible: false,
      variNewName: "",
    }
    this.newVariClick = this.newVariClick.bind(this)
    this.startGame = this.startGame.bind(this)
    this.hMenuClose = this.hMenuClose.bind(this)
    this.hMenuOpen = this.hMenuOpen.bind(this)
    this.closeVariDeleteModal = this.closeVariDeleteModal.bind(this)
    this.openVariDeleteModal = this.openVariDeleteModal.bind(this)
    this.renameThisVari = this.renameThisVari.bind(this)
    this.deleteThisVari = this.deleteThisVari.bind(this)
    this.switchArchivedThisVari = this.switchArchivedThisVari.bind(this)
    this.no_variations_style = this.no_variations_style.bind(this)
  }

  getArchivedSeparator(){
    return  <div id="archivedVarsSeparator" key="archivedVarsSeparator"><p style={{textAlign: "center", color: "var(--titleColor)"}}>
              <Translator text="Archived variations" />
            </p></div>
  }

  getVariItems(vars, op_index) {
    if (vars.length > 0) {
      let not_archived = []
      let archived = []
      // populate not_archived and archived
      vars.map((cur, index) => {
        let item = <VariItem 
          vari={cur} 
          vari_index={index} 
          op_index={op_index}
          history={this.props.history} 
          key={`variItem_${op_index}_${index}`} 
          switchVariArchived={this.props.switchVariArchived}
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
      return <p><Translator text={"no_variations"}/></p>
    }
  }

  newVariClick(){
    this.props.history.push("/newVariation/" + this.props.match.params.op_index)
  }

  startGame(){
    this.props.history.push("/training/" + this.props.match.params.op_index)
  }

  hMenuClose(){
    this.setState({hMenuVisible: false})
  }

  hMenuOpen(vari_index){
    this.setState({hMenuVisible: true, hMenuVariIndex: vari_index})
  }

  closeVariDeleteModal(){
    this.setState({variDeleteVisible: false})
  }

  openVariDeleteModal(){
    this.setState({variDeleteVisible: true})
  }

  renameThisVari(){
    const op_index = this.props.match.params.op_index
    this.props.renameVari(op_index, this.state.hMenuVariIndex, this.state.variNewName)
  }

  deleteThisVari(){
    const op_index = this.props.match.params.op_index
    this.props.deleteVari(op_index, this.state.hMenuVariIndex)
  }

  switchArchivedThisVari(){
    const op_index = this.props.match.params.op_index
    this.props.switchVariArchived(op_index, this.state.hMenuVariIndex)
  }

  no_variations_style(len){
    if(len > 0) return {}
    return {
      background: `url(${no_variations_svg})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center"
    }
  }

  render() {
    const op_index = this.props.match.params.op_index
    const op = this.props.ops[op_index]
    const thisVari = this.state.hMenuVariIndex !== undefined ? this.props.ops[op_index].variations[this.state.hMenuVariIndex] : null
    return (
      <React.Fragment>
        <Header title={op.op_name} mainButtonText="keyboard_backspace"/*headerButtonContent={<span className="iconText">school</span>}*/ /> {/* play_arrow */}
        <div id="openingPage" className="page" style={this.no_variations_style(op.variations.length)}>{this.getVariItems(op.variations, op_index)}</div>
        <button id="playVarsButton" className="importantButton iconButton" onClick={this.startGame}>
          school
        </button>
        <button id="newVariButton" className="importantButton iconButton" onClick={this.newVariClick}>
          add
        </button>
        
        <HangingMenu visible={this.state.hMenuVisible} close={this.hMenuClose}>
          {/* EDIT BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => this.setState({renameVariVisible: true, variNewName: "", hMenuVisible: false})}>
            edit
          </button>
          {/* ARCHIVED BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => {this.hMenuClose(); this.switchArchivedThisVari();}}>
              {thisVari ? (thisVari.archived ? "unarchive" : "archive") : null}
          </button>
          {/* DELETE BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => {this.hMenuClose(); this.openVariDeleteModal();}}>
            <span style={{color: "var(--alertColor)"}}>delete</span>
          </button>
        </HangingMenu>
        
        {/* DELETE VARI MODAL */}
        <Modal 
          id="deleteVaripModal" 
          visible={this.state.variDeleteVisible} 
          close={this.closeVariDeleteModal}
          doneButtonText={<span className="alertText iconText">delete</span>}
          onDoneClick={this.deleteThisVari}>
            { this.state.variDeleteVisible ? 
              <React.Fragment><h2><Translator text={"Delete permanently:"} />&nbsp;<span className="alertText">{thisVari.vari_name}</span>{"?"}</h2></React.Fragment> : null
            }     
        </Modal>
        {/* RENAME VARI MODAL */}
        <Modal 
          visible={this.state.renameVariVisible} 
          close={() => this.setState({renameVariVisible: false})} 
          onDoneClick={this.renameThisVari} 
          disabledDoneButton={this.state.variNewName.length === 0}
        >
          { this.state.renameVariVisible ? 
            <React.Fragment>
              <h2>
                <Translator text={"Rename"} />&nbsp;
                <span style={{color: "var(--importantButtonBackColor)"}}>{thisVari.vari_name}</span>&nbsp;
                <Translator text={"to:"} />&nbsp;
              </h2>
              <input type="text" 
                className="textBox renameTextBox"
                value={this.state.variNewName} 
                onChange={e => this.setState({variNewName: e.target.value})}
                onKeyPress={e => {
                  if (e.which === 13 || e.keyCode === 13) {
                    this.renameThisVari()
                    this.setState({renameVariVisible: false})
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

export default OpeningPage
