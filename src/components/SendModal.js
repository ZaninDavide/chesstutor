import React, { Component } from "react"
import Translator from "./Translator"
import "../styles/Modal.css"

class SendModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sendNames: []
    }
    this.getStyle = this.getStyle.bind(this);
    this.onDone = this.onDone.bind(this);
    this.addName = this.addName.bind(this);
    this.getNameItems = this.getNameItems.bind(this);
    this.deleteName = this.deleteName.bind(this);
  }

  getStyle(){
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
    }
  }

  onDone(){
    if(this.state.sendNames.length > 0){
      this.props.sendOpening(this.state.sendNames, this.props.op_index)
    }
    this.props.close()
  }

  addName(){
    this.setState(old => {
      let old_names = old.sendNames

      let new_names = old.sendName.split(", ").join(",").split(",")
      new_names.forEach(name => {
        if(name && old_names.indexOf(name) === -1){
          // old_names.push(name)
          old_names.splice(0, 0, name)
        }else{
          return {}
        }
      });

      return {
        sendName: "",
        sendNames: old_names,
      }
    })
  }

  deleteName(index){
    this.setState(old => {
      let old_names = old.sendNames
      if(index < old_names.length){
        old_names.splice(index, 1)
        return {
          sendNames: old_names,
        }
      }else{
        return {}
      }
    })
  }

  getNameItems(){
    return this.state.sendNames.map((name, index) => {
      return <div key={"sendNameItem_" + name} className="sendNameItem">
          <button className="simpleButton iconText"
            onClick={() => this.deleteName(index)}
          >delete</button>
          <div className="sendNameLabel">{name}</div>
        </div>
    })
  }

  render() {
    return (
      <div id="sendModal" className="modal" onClick={this.props.close} style={this.getStyle()}>
        <div className="modalContent sendModalContent" onClick={e => e.stopPropagation()}>
          <div className="insideModal" onClick={e => e.stopPropagation()}>
            <h2><Translator text={"Send"} />&nbsp;<span style={{color: "var(--impButtonBack)"}}>{this.props.op ? this.props.op.op_name : ""}</span>&nbsp;<Translator text={"to"} />{":"}</h2>
            <input type="text" id="sendTextbox"
                className="textBox"
                value={this.state.sendName}
                onChange={e => {this.setState({sendName: e.target.value})}}
                onKeyPress={e => {
                  if (e.which === 13 || e.keyCode === 13) {
                    this.addName()
                  }
                }}
            />
            <button className="simpleButton iconText newSendButton" 
              onClick={this.addName}
            >add</button>
            <div id="sendNamesList">
              {this.getNameItems()}
            </div>
          </div>
          <div className="modalButtons" style={{textAlign: "right"}}>
            <button className="modalButton simpleButton iconText"
              onClick={this.onDone}
              disabled={this.state.sendNames.length === 0}
            >send</button>
            <button className="simpleButton modalBackButton"
              onClick={() => {
                  this.props.close()
              }}
            ><span className="iconText">close</span></button>
          </div>
        </div>
      </div>
    )
  }

}

export default SendModal
