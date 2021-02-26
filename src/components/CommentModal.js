import React, { Component } from "react"
import Translator from "../components/Translator"
import "../styles/Modal.css"
import CheckBox from "./CheckBox"

class CommentModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.getComment(this.props.op_index, this.props.json_moves),
      invertDrawBoardPDF: false
    }
    this.getStyle = this.getStyle.bind(this);
    this.onDone = this.onDone.bind(this);
  }

  getStyle() {
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
    }
  }

  onDone() {
    this.props.editComment(this.props.op_index, this.props.json_moves, this.state.text)
    if (this.state.invertDrawBoardPDF) {
      let value = this.props.getDrawBoardPDF(this.props.op_index, this.props.json_moves)
      if (this.state.invertDrawBoardPDF) {
        value = !value
      }
      this.props.setDrawBoardPDF(this.props.op_index, this.props.json_moves, value)
    }
    this.props.close()
  }

  render() {
    return (
      <div id="commentModal" className="modal" onClick={this.props.close} style={this.getStyle()}>
        <div className="modalContent tallModalContent" onClick={e => e.stopPropagation()}>
          <div className="insideModal insideCommentModal" onClick={e => e.stopPropagation()}>
            <textarea placeholder={"Comment"} onChange={e => this.setState({ text: e.target.value })} className="commentTextBox" type="text" value={this.state.text}></textarea>
            <div style={{ marginLeft: "var(--mediumMargin)" }}>
              <CheckBox
                text={<Translator text={"draw_board_pdf"} />}
                click={() => this.setState(old => { return { invertDrawBoardPDF: !old.invertDrawBoardPDF } })}
                checked={
                  this.props.getDrawBoardPDF(this.props.op_index, this.props.json_moves) ?  !this.state.invertDrawBoardPDF :  this.state.invertDrawBoardPDF
                }
              />
            </div>

            {/*            
<div className="checkBoxContainer commentCheckBox" style={{marginLeft: "var(--mediumMargin)"}}>
              <span 
                style={{display: "flex"}} 
              >
                <div className={"checkBox" + 
                  ((this.state.invertDrawBoardPDF ? !this.props.getDrawBoardPDF(this.props.op_index, this.props.json_moves) : this.props.getDrawBoardPDF(this.props.op_index, this.props.json_moves)) 
                  ? " checked" : "")}
                />
                &nbsp;
                <Translator text={"draw_board_pdf"}/>
              </span>
    </div>
    */}
          </div>
          <div className="modalButtons" style={{ textAlign: "right" }}>
            <button className="modalButton simpleButton iconText"
              disabled={this.props.disabledDoneButton}
              onClick={this.onDone}
            >done</button>
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

export default CommentModal
