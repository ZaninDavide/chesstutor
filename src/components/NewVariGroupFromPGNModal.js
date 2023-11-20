import React, { Component } from "react"
import Translator from "./Translator"
import "../styles/Modal.css"
import Modal from "./Modal"

const pgnExample = "1. e4 d5 2. exd5 Qxd5 3. Nc3 (3. Nf3 Bg4 (3... Nc6 4. d4) 4. Be2 Nc6 5. O-O) 3... Qa5 4. d4 Nf6"

class NewVariGroupFromPGNModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      new_vari_name: "",
      text: "",
    }
    this.done = this.done.bind(this)
  }

  done(){
    this.props.addVariations(this.state.new_vari_name, this.state.text)
    this.props.close()
  }

  render() {
    return (
      <Modal 
        id="newVariGroupFromPGNModal" 
        visible={this.props.visible} 
        close={this.props.close}
        doneButtonText={<span className="impText iconText">upload</span>}
        onDoneClick={this.done}
        disabledDoneButton={this.state.new_vari_name.trim().length === 0 || this.state.text.trim().length === 0}
        tallModal={true}
        insideModalClasses="insideGroupFromPGNModal"
      >
        {this.props.visible ? 
          <React.Fragment>
            <h2><Translator text={"Choose a name for this group of variations"} /></h2>  
            <input type="text" 
              id="newVariGroupTextBox"
              className="textBox"
              value={this.state.new_vari_name} 
              onChange={e => this.setState({new_vari_name: e.target.value})}
              onKeyPress={e => { if (e.which === 13 || e.keyCode === 13) { this.done() } }}
            />
            <textarea placeholder={pgnExample} onChange={e => this.setState({ text: e.target.value })} className="pgnTextBox" type="text" value={this.state.text}></textarea>
          </React.Fragment> : null
        }     
      </Modal>
    )
  }

}

export default NewVariGroupFromPGNModal
