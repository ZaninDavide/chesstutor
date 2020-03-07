import React, { Component } from "react"
import Translator from "../components/Translator"
import "../styles/Modal.css"

class CommentModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.getComment(this.props.op_index, this.props.json_moves),
    }
    this.getStyle = this.getStyle.bind(this);
    this.onDone = this.onDone.bind(this);
  }

  getStyle(){
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
    }
  }

  onDone(){
    this.props.editComment(this.props.op_index, this.props.json_moves, this.state.text)
    this.props.close()
  }

  render() {
    return (
      <div id="commentModal" className="modal" onClick={this.props.close} style={this.getStyle()}>
        <div className="modalContent" onClick={e => e.stopPropagation()} style={{height: "auto"}}>
          <div className="insideModal" onClick={e => e.stopPropagation()}>
            <textarea placeholder={"Comment"} onChange={e => this.setState({text: e.target.value})} className="commentTextBox" type="text" value={this.state.text}></textarea>
            <div className="checkBoxContainer" style={{marginLeft: "var(--mediumMargin)"}}>
              <span 
                onClick={() => this.props.switchDrawBoardPDF(this.props.op_index, this.props.json_moves)} 
                style={{display: "flex"}} 
              >
                <div className={"checkBox" + (this.props.getDrawBoardPDF(this.props.op_index, this.props.json_moves) ? " checked" : "")}/>
                &nbsp;
                <Translator text={"Draw this board position on PDF"}/>
              </span>
            </div>
          </div>
          <div className="modalButtons" style={{textAlign: "right"}}>
            <button className="commentModalButton simpleButton iconText"
              disabled={this.props.disabledDoneButton}
              onClick={this.onDone}
            >done</button>
          </div>
        </div>
      </div>
    )
  }

}

export default CommentModal
