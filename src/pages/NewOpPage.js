import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import Ripples from "react-ripples"

class NewOpPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      new_op_name: "",
      studyAs: "white"
    }
    this.getStudyAsButtonColor = this.getStudyAsButtonColor.bind(this)
    this.setStudyAs = this.setStudyAs.bind(this)
    this.createButtonClick = this.createButtonClick.bind(this)
  }

  getStudyAsButtonColor(buttonColor) { // "white" or "black"
    return this.state.studyAs === buttonColor ? "var(--main)" : "var(--text)"
  }

  setStudyAs(color) {
    this.setState({ studyAs: color })
  }

  createButtonClick() {
    const op_index = this.props.createOp(this.state.new_op_name, this.state.studyAs)
    this.props.history.push("/openings/" + op_index)
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"New opening"}/>}  mainButtonText="arrow_back"/>
        <div id="newOpPage" className="page">
          <div id="newOpPageBody">
            <Translator text={"Opening name"} />:
            <input type="text" className="textBox" value={this.state.new_op_name} onChange={e => this.setState({ new_op_name: e.target.value })} />
            <br /><br />
            <Translator text={"Study as"} />:&nbsp;&nbsp;
          
          <div className="optionButtonsContainer">
            <Ripples><button className="simpleButton" onClick={() => this.setStudyAs("white")} style={{ marginRight: 0, color: this.getStudyAsButtonColor("white") }}><Translator text={"White"} /></button></Ripples>
            <Ripples><button className="simpleButton" onClick={() => this.setStudyAs("black")} style={{ marginLeft: 0, color: this.getStudyAsButtonColor("black") }}><Translator text={"Black"} /></button></Ripples>
          </div>
          
          </div>
          <button disabled={this.state.new_op_name.length === 0} onClick={this.createButtonClick} className="barButton impButton" style={{ position: "absolute", bottom: "var(--mediumMargin)", marginBottom: 0, width: "calc(100% - 30px)" }}><Translator text={"Create"} /></button>
        </div>
      </React.Fragment>
    )
  }
}

export default NewOpPage
