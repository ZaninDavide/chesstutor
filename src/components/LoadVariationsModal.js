import React, { Component } from "react"
import "../styles/Modal.css"

const pgnExample = "1. e4 d5 2. exd5 Qxd5 3. Nc3 (3. Nf3 Bg4 (3... Nc6 4. d4) 4. Be2 Nc6 5. O-O) 3... Qa5 4. d4 Nf6"


class LoadVariationsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: "",
    }
    this.onDone = this.onDone.bind(this);
  }

  onDone() {
    this.props.addVariations(this.state.text)
    this.props.close()
  }

  render() {
    return (
      <div id="commentModal" className={"modal" + (this.props.visible ? " modalVisible" : " modalHidden")} onClick={this.props.close}>
        <div className="modalContent tallModalContent" onClick={e => e.stopPropagation()}>
          <div className="insideModal insideCommentModal" onClick={e => e.stopPropagation()}>
            <textarea placeholder={pgnExample} onChange={e => this.setState({ text: e.target.value })} className="commentTextBox" type="text" value={this.state.text}></textarea>
          </div>
          <div className="modalButtons" style={{ textAlign: "right" }}>
            <button className="modalButton simpleButton iconText"
              disabled={this.state.text.trim().length === 0}
              onClick={this.onDone}
            ><span className="impText iconText">upload</span></button>
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

export default LoadVariationsModal
