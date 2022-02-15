import React, { Component } from "react"
import Translator from "./Translator"
import "../styles/Modal.css"
import Modal from "./Modal"

class NewVariGroupModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      new_vari_name: "",
    }
    this.done = this.done.bind(this)
  }

  done(){
    this.props.history.push("/newVariation/" + this.props.op_index + "/" + this.state.new_vari_name.trim())
  }

  render() {
    return (
      <Modal 
        id="newVariGroupModal" 
        visible={this.props.visible} 
        close={this.props.close}
        doneButtonText={<span className="impText iconText">add</span>}
        onDoneClick={this.done}
        disabledDoneButton={this.state.new_vari_name.trim().length === 0}
      >
        {this.props.visible ? 
          <React.Fragment>
            <h2><Translator text={"Choose a name for this group of variations"} /></h2>  
            <input type="text" 
              id="newVariGroupTextBox"
              className="textBox"
              value={this.state.new_vari_name} 
              onChange={e => this.setState({new_vari_name: e.target.value})}
              onKeyPress={e => {
                if (e.which === 13 || e.keyCode === 13) {
                  this.done()
                }
              }}
            />
          </React.Fragment> : null
        }     
      </Modal>
    )
  }

}

export default NewVariGroupModal
