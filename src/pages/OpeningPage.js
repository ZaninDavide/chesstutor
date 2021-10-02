import React, { Component } from "react"
import Header from "../components/Header"
import VariItem from "../components/VariItem"
import Translator from "../components/Translator"
import HangingMenu from "../components/HangingMenu"
import Modal from "../components/Modal"
import RenameVariModal from "../components/RenameVariModal"
import NewVariGroupModal from "../components/NewVariGroupModal"
import VariGroupModal from "../components/VariGroupModal"


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
      newVariGroupModalVisible: false,
      variGroupModalVisible: false,
    }
    this.newVariClick = this.newVariClick.bind(this)
    this.startGame = this.startGame.bind(this)
    this.hMenuClose = this.hMenuClose.bind(this)
    this.hMenuOpen = this.hMenuOpen.bind(this)
    this.closeVariDeleteModal = this.closeVariDeleteModal.bind(this)
    this.openVariDeleteModal = this.openVariDeleteModal.bind(this)
    this.openVariRenameModal = this.openVariRenameModal.bind(this)
    this.renameThisVari = this.renameThisVari.bind(this)
    this.deleteThisVari = this.deleteThisVari.bind(this)
    this.switchArchived = this.switchArchived.bind(this)
    this.no_variations_style = this.no_variations_style.bind(this)
  }

  getArchivedSeparator() {
    return <div id="archivedVarsSeparator" key="archivedVarsSeparator">
      <h3 className="alertText">
        <Translator text="Archived variations" />
      </h3>
    </div>
  }

  getVariItems(vars, op_index) {
    let not_archived = {}
    let archived = {}

    let sortedVars = vars.map((c, i) => { return { vari_name: c.vari_name, vari_subname: c.vari_subname, index: i, archived: c.archived } })

    sortedVars.sort((a, b) => {
      if (a.vari_name === b.vari_name) {
        if (a.vari_subname === undefined || a.vari_subname === null) return -1
        if (b.vari_subname === undefined || b.vari_subname === null) return 1
        return a.vari_subname.localeCompare(b.vari_subname)
      }
      return a.vari_name.localeCompare(b.vari_name);
    })

    sortedVars.forEach(cur => {
      let item = <VariItem
        vari={vars[cur.index]}
        vari_index={cur.index}
        op_index={op_index}
        archived={cur.archived}
        history={this.props.history}
        key={`variItem_${op_index}_${cur.index}`}

        delete={() => this.openVariDeleteModal(cur.index)}
        switch_archive={() => this.switchArchived(cur.index)}
        rename={() => this.openVariRenameModal(cur.index)}
      />

      let group = cur.archived ? archived : not_archived
      if (group[cur.vari_name]) {
        group[cur.vari_name].push(item)
      } else {
        group[cur.vari_name] = [item]
      }
    })

    let html = []

    Object.keys(not_archived).forEach(vari_name => {
      html.push(
        <div className="variationFolder" key={"variationFolder_" + vari_name}>
          <div className="variationTitle" key={"variationTitle_" + vari_name}>
            <h3>{vari_name}</h3>
            <button
              className="variationExtraButton iconText"
              onClick={() => this.setState({variGroupModalVisible: true, selected_vari_group_name: vari_name})}
            >edit</button>
          </div>
          <div id="variationFolderList">
            {not_archived[vari_name]}
          </div>
          <div id="variationFolderLearnContainer">
            <div id="variationFolderLearnFiller"></div>
            <div id="variationFolderLearnButtons">
              <button id="variationFolderLearn" className="barButton"
                onClick={() => {
                  this.props.history.push("/openings/" + this.props.match.params.op_index + "/" + vari_name + "/" + this.props.getOpColor(parseInt(this.props.match.params.op_index)) + "/[]")
                }}
              >
                <span className="iconText">menu_book</span>
              </button>
              <button id="variationFolderLearn" className="barButton"
                onClick={() => {
                  this.props.history.push("/openings/training/" + this.props.match.params.op_index + "/" + vari_name)
                }}
              >
                <span className="iconText">school</span>
              </button>
              <button id="variationFolderLearn" className="barButton"       
                onClick={() => {
                  this.props.history.push("/newVariation/" + this.props.match.params.op_index + "/" + vari_name)
                }}
              >
                <span className="iconText">add</span>
              </button>
            </div>
          </div>
        </div>
      )
    })

    // if(Object.keys(archived).length > 0) html.push(this.getArchivedSeparator())

    Object.keys(archived).forEach(vari_name => {
      html.push(
        <div className="variationFolder" key={"variationFolderArchived_" + vari_name}>
          <div className="variationTitleArchived" key={"variationTitleArchived_" + vari_name}>
            <h3>{vari_name}</h3>
          </div>
          {archived[vari_name]}
        </div>
      )
    })

    return html
  }

  newVariClick() {
    this.props.history.push("/newVariation/" + this.props.match.params.op_index)
  }

  startGame() {
    this.props.history.push("/training/" + this.props.match.params.op_index)
  }

  hMenuClose() {
    this.setState({ hMenuVisible: false })
  }

  hMenuOpen(vari_index) {
    this.setState({ hMenuVisible: true, hMenuVariIndex: vari_index })
  }

  closeVariDeleteModal() {
    this.setState({ variDeleteVisible: false })
  }

  openVariDeleteModal(vari_index) {
    if (vari_index !== undefined) {
      this.setState({ hMenuVariIndex: vari_index, variDeleteVisible: true })
    } else {
      this.setState({ variDeleteVisible: true })
    }
  }

  openVariRenameModal(vari_index) {
    if (vari_index !== undefined) {
      this.setState({ hMenuVariIndex: vari_index, renameVariVisible: true })
    } else {
      this.setState({ renameVariVisible: true })
    }
  }

  renameThisVari(variNewName, variNewSubname) {
    const op_index = parseInt(this.props.match.params.op_index)
    this.props.renameVari(op_index, this.state.hMenuVariIndex, variNewName)
    this.props.setVariSubname(op_index, this.state.hMenuVariIndex, variNewSubname)
  }

  deleteThisVari() {
    const op_index = parseInt(this.props.match.params.op_index)
    this.props.deleteVari(op_index, this.state.hMenuVariIndex)
  }

  switchArchived(vari_index) {
    const op_index = parseInt(this.props.match.params.op_index)
    if (vari_index !== undefined) {
      this.props.switchVariArchived(op_index, vari_index)
    } else {
      this.props.switchVariArchived(op_index, this.state.hMenuVariIndex)
    }
  }

  no_variations_style(len) {
    if (len > 0) return {}
    return {
      background: `url("/files/no_variations.svg")`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center"
    }
  }

  render() {
    const op_index = parseInt(this.props.match.params.op_index)
    const op = this.props.ops[op_index]
    const thisVari = this.state.hMenuVariIndex !== undefined ? this.props.ops[op_index].variations[this.state.hMenuVariIndex] : null
    return (
      <React.Fragment>
        <Header title={op.op_name} mainButtonText="arrow_back"/*headerButtonContent={<span className="iconText">school</span>}*/ /> {/* play_arrow */}
        <div id="openingPage" className="page" style={this.no_variations_style(op.variations.length)}>
          {this.getVariItems(op.variations, op_index)}
          <div id="newVariationBox" onClick={() => this.setState({ newVariGroupModalVisible: true })}>
            +
            <div>
              <Translator text="group" />
            </div>
          </div>
        </div>
        <button id="playVarsButton" className="roundButton iconButton impButton"
          onClick={this.startGame}
          disabled={op.variations.length === 0}
        >
          school
        </button>
        {/*<button id="newVariButton" className="roundButton iconButton impButton" onClick={this.newVariClick}>
          add
        </button>*/}

        <HangingMenu visible={this.state.hMenuVisible} close={this.hMenuClose}>
          {/* DELETE BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => { this.hMenuClose(); this.openVariDeleteModal(); }}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon"><span className="alertText">delete</span></div>
              <div className="hMenuButtonLabel"><span className="alertText">Delete</span></div>
            </div>
          </button>
          {/* ARCHIVED BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => { this.hMenuClose(); this.switchArchived(); }}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">{thisVari ? (thisVari.archived ? "unarchive" : "archive") : ""}</div>
              <div className="hMenuButtonLabel">{thisVari ? (thisVari.archived ? "Unarchive" : "Archive") : ""}</div>
            </div>

          </button>
          {/* EDIT BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => this.setState({ renameVariVisible: true, variNewName: "", hMenuVisible: false })}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">edit</div>
              <div className="hMenuButtonLabel">Rename</div>
            </div>
          </button>
        </HangingMenu>

        {/* DELETE VARI MODAL */}
        <Modal
          id="deleteVariModal"
          visible={this.state.variDeleteVisible}
          close={this.closeVariDeleteModal}
          doneButtonText={<span className="alertText iconText">delete</span>}
          onDoneClick={this.deleteThisVari}>
          {this.state.variDeleteVisible ?
            <React.Fragment><h2><Translator text={"Delete permanently:"} />&nbsp;<span className="alertText">{thisVari.vari_name}</span>{"?"}</h2></React.Fragment> : null
          }
        </Modal>
        {/* RENAME VARI MODAL */}
        <RenameVariModal
          visible={this.state.renameVariVisible}
          close={() => this.setState({ renameVariVisible: false })}
          thisVari={this.state.renameVariVisible ? thisVari : undefined}
          renameThisVari={this.renameThisVari}
        /> 
        {/*i do this so that every time you open it the modal refreshes and takes new default values*/}

        {/* NEW VARI_GROUP MODAL */}
        <NewVariGroupModal
          visible={this.state.newVariGroupModalVisible}
          close={() => this.setState({ newVariGroupModalVisible: false })}
          history={this.props.history}
          op_index={this.props.match.params.op_index}
        ></NewVariGroupModal>

        <HangingMenu 
          visible={this.state.variGroupModalVisible} 
          close={() => this.setState({ variGroupModalVisible: false })}
          title={this.state.selected_vari_group_name}
        >
          {/* DELETE BUTTON */}
          <button className="simpleButton hMenuButton" 
            onClick={() => {           
              this.props.deleteVariGroup(this.props.match.params.op_index, this.state.selected_vari_group_name);
              this.setState({ variGroupModalVisible: false }); 
            }}
          >
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon"><span className="alertText">delete</span></div>
              <div className="hMenuButtonLabel"><span className="alertText"><Translator text="Delete" /></span></div>
            </div>
          </button>
          {/* EDIT BUTTON */}
          <button className="simpleButton hMenuButton" onClick={() => this.setState({ variGroupRenameModalVisible: true, variGroupModalVisible: false })}>
            <div className="hMenuButtonContent">
              <div className="hMenuButtonIcon">edit</div>
              <div className="hMenuButtonLabel"><Translator text="Rename" /></div>
            </div>
          </button>
        </HangingMenu>

        {/* EDIT VARI_GROUP MODAL */}
        <VariGroupModal
          visible={this.state.variGroupRenameModalVisible}
          close={() => this.setState({ variGroupRenameModalVisible: false })}
          op_index={this.props.match.params.op_index}
          vari_group_name={this.state.selected_vari_group_name}
          renameThisVariGroup={new_name => this.props.renameVariGroup(this.props.match.params.op_index, this.state.selected_vari_group_name, new_name) }
        />
      </React.Fragment>
    )
  }
}

export default OpeningPage
