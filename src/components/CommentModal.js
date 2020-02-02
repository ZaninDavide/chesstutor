import React, { Component } from "react"
import "../styles/Modal.css"

class CommentModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.getComment(this.props.op_index, this.props.json_moves)
    }
    this.getStyle = this.getStyle.bind(this);
    this.onDone = this.onDone.bind(this);
  }

  getStyle(){
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0)",
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
          <textarea placeholder={"Comment"} onChange={e => this.setState({text: e.target.value})} className="commentTextBox" type="text" value={this.state.text}></textarea>
          <br/>
          <div className="modalButtons" style={{textAlign: "right"}}>
            <button className="commentModalButton simpleButton"
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
