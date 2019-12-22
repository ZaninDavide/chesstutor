import React, { Component } from "react"
import Header from "../components/Header"
import VariItem from "../components/VariItem"

class OpeningPage extends Component {
  constructor(props) {
    super(props)
    if (props.ops.length < props.match.params.op_index) {
      console.log("OpeningPage: constructor: This opening do not exists.")
    }
    this.newVariClick = this.newVariClick.bind(this)
  }

  getVariItems(vars, op_index) {
    return vars.map((cur, index) => <VariItem vari={cur} vari_index={index} op_index={op_index} history={this.props.history} key={`variItem_${op_index}_${index}`} />)
  }

  newVariClick(){
    this.props.history.push("/newVariation/" + this.props.match.params.op_index)
  }

  render() {
    const op_index = this.props.match.params.op_index
    const op = this.props.ops[op_index]
    return (
      <React.Fragment>
        <Header title={op.op_name} headerButtonContent={<span className="iconText">school</span>} /> {/* play_arrow */}
        <div className="page">{this.getVariItems(op.variations, op_index)}</div>
        <button id="newVariButton" className="importantButton" onClick={this.newVariClick}>
          +
        </button>
      </React.Fragment>
    )
  }
}

export default OpeningPage
