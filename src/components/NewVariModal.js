import React, { Component } from "react"
import "../styles/Modal.css"
import Modal from "../components/Modal"
import Translator from "../components/Translator"

const sub_names = [
  undefined,
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 
  "A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2", "K2", "L2", "M2", "N2", "O2", "P2", "Q2", "R2", "S2", "T2", "U2", "V2", "W2", "X2", "Y2", "Z2", 
  "A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3", "K3", "L3", "M3", "N3", "O3", "P3", "Q3", "R3", "S3", "T3", "U3", "V3", "W3", "X3", "Y3", "Z3",
]

class NewVariModal extends Component {
  constructor(props) {
    super(props)
    this.getStyle = this.getStyle.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      new_vari_name: "",
      new_vari_subname: ""
    }
  }

  getStyle(){
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
    }
  }

  close(){
    this.props.close()
  }

  render() {
    return (
      <Modal 
          visible={this.props.visible} 
          close={this.close} 
          onDoneClick={() => this.props.createThisVariation(this.state.new_vari_name, this.state.new_vari_subname)} 
          disabledDoneButton={this.state.new_vari_name.length === 0}
          key="new_variation_modal"
        >
          <h2><Translator text={"New variation name"} />:</h2>
          <input type="text" 
            id="newVariNameTextBox"
            className="textBox renameTextBox"
            value={this.state.new_vari_name} 
            onChange={e => {
              const vari_name = e.target.value
              const allowed_subnames = this.props.getOpFreeSubnames(this.props.op_index, vari_name, sub_names)
              this.setState(old => {
                if(allowed_subnames.indexOf(old.new_vari_subname) === -1){
                  return {new_vari_name: vari_name, new_vari_subname: allowed_subnames[0] !== undefined ? allowed_subnames[0] : allowed_subnames[1]}
                }else{
                  return {new_vari_name: vari_name}
                }
              })
            }}
            onKeyPress={e => {
              if (e.which === 13 || e.keyCode === 13) {
                this.props.createThisVariation(this.state.new_vari_name, this.state.new_vari_subname)
              }
            }}
          />
          <select id="subNameSelector" onChange={e => this.setState({new_vari_subname: e.target.value})} value={this.state.new_vari_subname}>
            {this.props.getOpFreeSubnames ? 
              this.props.getOpFreeSubnames(this.props.op_index, this.state.new_vari_name, sub_names).map(c => <option value={c} selected={c === this.state.new_vari_subname ? "selected" : ""} className="subNameOption">{c}</option>)
            : null}
          </select>
      </Modal>
    )
  }

}
export default NewVariModal
