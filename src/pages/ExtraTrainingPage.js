import React, { Component } from "react"
import Header from "../components/Header"
import Translator from "../components/Translator"
import Ripples from "react-ripples"

class ExtraTrainingPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      studyAs: "white"
    }
    this.setStudyAs = this.setStudyAs.bind(this);
    this.getStudyAsButtonColor = this.getStudyAsButtonColor.bind(this);
    this.startTraining = this.startTraining.bind(this);
  }

  setStudyAs(color) {
    this.setState({studyAs: color});
  }

  getStudyAsButtonColor(buttonColor) { // "white" or "black"
    return this.state.studyAs === buttonColor ? "var(--main)" : "var(--text)"
  }

  startTraining() {
    this.props.history.push("/training/fullcolor/" + (this.state.studyAs === "white" ? 1 : 0));
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Training"}/>}  mainButtonText="arrow_back"/>
        <div id="extraTrainingPage" className="page">
          <div id="extraTrainingPageBody">
            <Translator text={"Study as"} />:&nbsp;&nbsp;
          
            <div className="optionButtonsContainer">
              <Ripples><button className="simpleButton" onClick={() => this.setStudyAs("white")} style={{ marginRight: 0, color: this.getStudyAsButtonColor("white") }}><Translator text={"White"} /></button></Ripples>
              <Ripples><button className="simpleButton" onClick={() => this.setStudyAs("black")} style={{ marginLeft: 0, color: this.getStudyAsButtonColor("black") }}><Translator text={"Black"} /></button></Ripples>
            </div>
          
          </div>
          <button   
            onClick={this.startTraining}
            className="barButton impButton" 
            style={{ position: "absolute", bottom: "var(--mediumMargin)", marginBottom: 0, width: "calc(100% - 30px)" }}
          ><Translator text={"Start training"} /></button>
        </div>
      </React.Fragment>
    )
  }
}

export default ExtraTrainingPage
