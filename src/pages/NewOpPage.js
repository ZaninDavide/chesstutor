import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"

class NewOpPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      new_op_name: "Unnamed opening",
      studyAs: "white"
    }
    this.getStudyAsButtonColor = this.getStudyAsButtonColor.bind(this)
    this.setStudyAs = this.setStudyAs.bind(this)
    this.createButtonClick = this.createButtonClick.bind(this)
  }

  getStudyAsButtonColor(buttonColor){ // "white" or "black"
    return this.state.studyAs === buttonColor ? "var(--buttonColor)" : "var(--textColor)"
  }

  setStudyAs(color){
    this.setState({studyAs: color})
  }

  createButtonClick(){
    const op_index = this.props.createOp(this.state.new_op_name, this.state.studyAs)
    this.props.history.push("/openings/" + op_index)
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"New opening"} />} />
        <div id="newOpPage" className="page">
          <div id="newOpPageBody">
            <Translator text={"Opening name"} />:
            <input type="text" className="textBox" value={this.state.new_op_name} onChange={e => this.setState({new_op_name: e.target.value})}/>
            <br/>
            <Translator text={"Study as"} />:&nbsp;&nbsp;
            <button className="simpleButton" onClick={() => this.setStudyAs("white")} style={{marginRight: 0, color: this.getStudyAsButtonColor("white")}}><Translator text={"White"}/></button>
            <button className="simpleButton" onClick={() => this.setStudyAs("black")} style={{marginLeft:  0, color: this.getStudyAsButtonColor("black")}}><Translator text={"Black"}/></button>
          </div>
          <button onClick={this.createButtonClick} className="importantButton" style={{position: "absolute", bottom: "var(--mediumMargin)", marginBottom: 0, width: "calc(100% - 30px)"}}><Translator text={"Create"} /></button>
        </div>
      </React.Fragment>
    )
  }
}

export default NewOpPage
