import React, { Component } from "react"
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
        <div className="variItemContent">
          <h2>{this.props.vari.vari_name}</h2>
          <p>
            {this.props.vari.moves.length} <Translator text={this.props.vari.moves.length === 1 ? "move" : "moves"} />
          </p>
        </div>
      </div>
    )
  }
}

export default VariItem
