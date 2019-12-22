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
    }
    this.getOpItems = this.getOpItems.bind(this)
    this.newOpButton = this.newOpButton.bind(this)
    this.hMenuClose = this.hMenuClose.bind(this)
    this.hMenuOpen = this.hMenuOpen.bind(this)
    this.closeOpDeleteModal = this.closeOpDeleteModal.bind(this)
    this.openOpDeleteModal = this.openOpDeleteModal.bind(this)
  }

  getOpItems(ops) {
    if (ops.length > 0) {
      return ops.map((cur, index) => <OpItem 
        op={cur} 
        op_index={index} 
        history={this.props.history} 
        key={`opItem_${index}`} 
        hMenuOpen={this.hMenuOpen} 
      />)
    } else {
      return <p><Translator text={"No openings yet! Use the + button in the right bottom corner to create a new one."}/></p>
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

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Openings"}/>} goTo={"/"}/>
        <div id="opsListPage" className="page">
          {this.getOpItems(this.props.ops)}
          <button id="newOpButton" className="importantButton" onClick={this.newOpButton}>
            +
          </button>
        </div>
        <HangingMenu visible={this.state.hMenuVisible} close={this.hMenuClose}>
          <button className="simpleButton hMenuButton">
            edit
          </button> 
          <button className="simpleButton hMenuButton">
            emoji_events 
          </button> 
          <button className="simpleButton hMenuButton">
            share
          </button>
          <button className="simpleButton hMenuButton">
            favorite_border {/*bookmark_border*/}
          </button> 
          <button className="simpleButton hMenuButton" onClick={() => {this.hMenuClose(); this.openOpDeleteModal();}}>
            delete
          </button>
        </HangingMenu>
        <Modal 
          id="deleteOpModal" 
          visible={this.state.opDeleteVisible} 
          close={this.closeOpDeleteModal} 
          onDoneClick={() => this.props.deleteOpening(this.state.hMenuOpIndex)}>
            { this.state.opDeleteVisible ? 
              <React.Fragment><h2><Translator text={"Delete permanently:"} />&nbsp;<span style={{color: "var(--importantButtonBackColor)"}}>{this.props.ops[this.state.hMenuOpIndex].op_name}</span>{"?"}</h2></React.Fragment> : null
            }     
          </Modal>
      </React.Fragment>
    )
  }
}

export default OpsListPage
