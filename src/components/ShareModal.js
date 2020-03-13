import React, { Component } from "react"
import Translator from "../components/Translator"
import "../styles/Modal.css"

class ShareModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shareNames: []
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
    // this.props.share()
    this.props.close()
  }

  addName(){
    this.setState(old => {
      let old_names = old.shareNames

      let new_names = old.shareName.split(", ").join(",").split(",")
      new_names.forEach(name => {
        if(name && old_names.indexOf(name) === -1){
          // old_names.push(name)
          old_names.splice(0, 0, name)
        }else{
          return {}
        }
      });

      return {
        shareName: "",
        shareNames: old_names,
      }
    })
  }

  deleteName(index){
    this.setState(old => {
      let old_names = old.shareNames
      if(index < old_names.length){
        old_names.splice(index, 1)
        return {
          shareNames: old_names,
        }
      }else{
        return {}
      }
    })
  }

  getNameItems(){
    return this.state.shareNames.map((name, index) => {
      return <div key={"shareNameItem_" + name} className="shareNameItem">
        <button id="newShareButton" className="simpleButton iconText"
          onClick={() => this.deleteName(index)}
        >delete</button>{name}</div>
    })
  }

  render() {
    return (
      <div id="shareModal" className="modal" onClick={this.props.close} style={this.getStyle()}>
        <div className="modalContent shareModalContent" onClick={e => e.stopPropagation()}>
          <div className="insideModal" onClick={e => e.stopPropagation()}>
    <h2><Translator text={"Share"} />&nbsp;<span style={{color: "var(--impButtonBack)"}}>{this.props.op ? this.props.op.op_name : ""}</span>&nbsp;<Translator text={"with"} />{":"}</h2>
            <input type="text" id="shareTextbox"
                className="textBox"
                value={this.state.shareName}
                onChange={e => {this.setState({shareName: e.target.value})}}
                onKeyPress={e => {
                  if (e.which === 13 || e.keyCode === 13) {
                    this.addName()
                  }
                }}
            />
            <button id="newShareButton" className="simpleButton iconText" 
              onClick={this.addName}
            >add</button>
            <div id="shareNamesList">
              {this.getNameItems()}
            </div>
          </div>
          <div className="modalButtons" style={{textAlign: "right"}}>
            <button className="modalButton simpleButton iconText"
              onClick={this.onDone}
              disabled={this.state.shareNames.length === 0}
            >share</button>
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

export default ShareModal
