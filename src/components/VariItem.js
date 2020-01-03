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
        /*onClick={() => this.props.switchVariActive(this.props.op_index, this.props.vari_index)}*/
        onContextMenu={e => {
          e.preventDefault();
          this.props.hMenuOpen(this.props.vari_index)
        }}
        style={{
          borderColor: this.props.vari.active ? "default" : "var(--alertColor)"
        }}
      >
        <div className="variItemContent">
          <h2>{this.props.vari.vari_name}</h2>
          <p>
            {this.props.vari.moves.length} <Translator text={this.props.vari.moves.length === 1 ? "move" : "moves"} />
          </p>
        </div>
        {/*<div className={"iconText variItemCheckbox"}>
          {this.props.vari.active ? "check_circle_outline" : "not_interested"}
        </div>*/}
      </div>
    )
  }
}

export default VariItem
