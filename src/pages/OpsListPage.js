import React, { Component } from "react"
import Header from "../components/Header"
import OpItem from "../components/OpItem"
import Translator from "../components/Translator"

class OpsListPage extends Component {
  constructor(props){
    super(props)
    this.getOpItems = this.getOpItems.bind(this)
    this.newOpButton = this.newOpButton.bind(this)
  }

  getOpItems(ops) {
    if (ops.length > 0) {
      return ops.map((cur, index) => <OpItem op={cur} op_index={index} history={this.props.history} key={`opItem_${index}`} />)
    } else {
      return <p><Translator text={"No openings yet! Use the + button in the right bottom corner to create a new one."}/></p>
    }
  }

  newOpButton(){
    this.props.history.push("/newOpening")
  }

  render() {
    return (
      <React.Fragment>
        <Header title={<Translator text={"Openings"}/>} goTo={"/"}/>
        <div id="opsListPage" className="page">
          {this.getOpItems(this.props.ops)}
          <button id="newOpButton" className="importantButton" onClick={this.newOpButton}>
            +
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default OpsListPage
