import React, { Component } from "react"
import Header from "../components/Header"
import VariItem from "../components/VariItem"
import Translator from "../components/Translator"
import HangingMenu from "../components/HangingMenu"
import Modal from "../components/Modal"
import RenameVariModal from "../components/RenameVariModal"

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
    return  <div id="archivedVarsSeparator" key="archivedVarsSeparator">
              <span className="alertText">
                <Translator text="Archived variations" />
              </span>
            </div>
  }

  getVariItems(vars, op_index) {
    if (vars.length > 0) {
      let not_archived = []
      let archived = []
      let sortedIndices = vars.map((c, i) => {return {vari_name: c.vari_name, vari_subname: c.vari_subname, index: i}})
      sortedIndices.sort((a, b) => {
        if(a.vari_name === b.vari_name){
          if(a.vari_subname === undefined || a.vari_subname === null) return -1
          if(b.vari_subname === undefined || b.vari_subname === null) return  1
          return a.vari_subname.localeCompare(b.vari_subname)
        }
        return a.vari_name.localeCompare(b.vari_name);
      })
      sortedIndices.forEach(cur => {
        // populate not_archived and archived
        let item = <VariItem 
          vari={vars[cur.index]} 
          vari_index={cur.index} 
          op_index={op_index}
          history={this.props.history} 
          key={`variItem_${op_index}_${cur.index}`} 
          switchVariArchived={this.props.switchVariArchived}
          hMenuOpen={this.hMenuOpen}
        />
        if(vars[cur.index].archived){ // add item to archived
          archived.push(item)
        }else{ // add item to not_archived
          not_archived.push(item)
        }
      });
      
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

  renameThisVari(variNewName, variNewSubname){
    const op_index = this.props.match.params.op_index
    this.props.renameVari(op_index, this.state.hMenuVariIndex, variNewName)
    this.props.setVariSubname(op_index, this.state.hMenuVariIndex, variNewSubname)
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
      background: `url("/files/no_variations.svg")`,
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
        <button id="playVarsButton" className="roundButton iconButton impButton" 
          onClick={this.startGame}
          disabled={op.variations.length === 0}
        >
          school
        </button>
        <button id="newVariButton" className="roundButton iconButton impButton" onClick={this.newVariClick}>
          add
        </button>
        
        <HangingMenu visible={this.state.hMenuVisible} close={this.hMenuClose}>
          {/* DELETE BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => {this.hMenuClose(); this.openVariDeleteModal();}}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon"><span className="alertText">delete</span></div>
              <div className="hMenuButtonLabel"><span className="alertText">Delete</span></div>
            </div>
          </button>
          {/* ARCHIVED BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => {this.hMenuClose(); this.switchArchivedThisVari();}}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">{thisVari ? (thisVari.archived ? "unarchive" : "archive") : null}</div>
              <div className="hMenuButtonLabel">{thisVari ? (thisVari.archived ? "Unarchive" : "Archive") : null}</div>
            </div>
              
          </button>
          {/* EDIT BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => this.setState({renameVariVisible: true, variNewName: "", hMenuVisible: false})}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">edit</div>
              <div className="hMenuButtonLabel">Rename</div>
            </div>
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
        {this.state.renameVariVisible ? <RenameVariModal
          visible={this.state.renameVariVisible}
          close={() => this.setState({renameVariVisible: false})}
          thisVari={thisVari}
          renameThisVari={this.renameThisVari}
        /> : null /*i do this so that every time you open it the modal refreshes and takes new default values*/}
      </React.Fragment>
    )
  }
}

export default OpeningPage
