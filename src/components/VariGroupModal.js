import React, { Component } from "react"
import Translator from "./Translator"
import "../styles/Modal.css"
import Modal from "./Modal"

class VariGroupModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      vari_group_name: this.props.vari_group_name,
    }
    this.done = this.done.bind(this)
  }

  UNSAFE_componentWillReceiveProps(props){
    this.setState({vari_group_name: props.vari_group_name})
  }

  done(){
    this.props.renameThisVariGroup(this.state.vari_group_name.trim())
    this.props.close()
  }

  render() {
    return (
      <Modal 
        id="variGroupModal" 
        visible={this.props.visible} 
        close={this.props.close}
        doneButtonText={<span className="impText iconText">edit</span>}
        onDoneClick={this.done}
        disabledDoneButton={!this.state.vari_group_name || this.state.vari_group_name.trim().length < 1}
      >
        {this.props.visible ? 
          <React.Fragment>
            <h2><Translator text={"Group name"} />:</h2>  
            <input type="text" 
              id="newVariGroupTextBox"
              className="textBox"
              value={this.state.vari_group_name} 
              onChange={e => this.setState({vari_group_name: e.target.value})}
              onKeyPress={e => {
                if (e.which === 13 || e.keyCode === 13) {
                  this.done()
                }
              }}
            />
            {/*<br/><br/>
            <h3><Translator text={"Manage group:"} /></h3>
            <button className="iconButton" onClick={() => {
              this.props.deleteThisVariGroup()
              this.props.close()
            }}>delete</button>*/}
          </React.Fragment> : null
        }     
      </Modal>
    )
  }

}

export default VariGroupModal
