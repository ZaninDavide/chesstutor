import React, { Component } from "react"
import { Link } from "react-router-dom"
import Translator from "./Translator"

class VariItem extends Component {
  constructor(props) {
    super(props)
    this.rightClick = this.rightClick.bind(this);
  }

  
  rightClick(e){
    e.preventDefault() /* avoids the menu to open */
    this.props.hMenuOpen(this.props.vari_index)
    return false /* avoids the menu to open */
  }

  render() {
    const thisVari = this.props.vari
    return (
        <div 
          className={"variItem" + (thisVari.vari_subname ? " subvariItem" : "")}
        >
          <div className="variItemText" onContextMenu={this.rightClick}>
            <Link to={"/openings/" + this.props.op_index + "/" + this.props.vari_index} className="variItemContent">
              {(() => {
                if(thisVari.vari_subname){
                  return <h2>{thisVari.vari_name + " "}<span className="impText">{thisVari.vari_subname}</span></h2>
                }else{
                  return <h2>{thisVari.vari_name}</h2>
                }
              })()}
              {<p className="smallText">
                {thisVari.moves.length} <Translator text={thisVari.moves.length === 1 ? "move" : "moves"} />
              </p>}
            </Link>
          </div>
          <div className="variItemButton iconText"  onClick={this.rightClick}>
            more_vert
          </div>
        </div>
      )
  }
}

export default VariItem
