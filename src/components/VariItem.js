import React, { Component } from "react"
import { Link } from "react-router-dom"
import Translator from "./Translator"

class VariItem extends Component {
  /*constructor(props) {
    super(props)
  }*/

  render() {
    return (
      <div 
        className="variItem"
        onContextMenu={e => {
          e.preventDefault();
          this.props.hMenuOpen(this.props.vari_index)
        }}
      >
        <Link to={"/openings/" + this.props.op_index + "/" + this.props.vari_index} className="variItemContent">
          <h2>{this.props.vari.vari_name}</h2>
          {<p className="smallText">
            {this.props.vari.moves.length} <Translator text={this.props.vari.moves.length === 1 ? "move" : "moves"} />
          </p>}
        </Link>
      </div>
    )
  }
}

export default VariItem
