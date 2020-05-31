import React, { Component } from "react"
import { Link } from "react-router-dom"
import Translator from "./Translator"

class VariItem extends Component {
  /*constructor(props) {
    super(props)
  }*/
  render() {
  const thisVari = this.props.vari
  return (
      <div 
        className={"variItem" + (thisVari.vari_subname ? " subvariItem" : "")}
        onContextMenu={e => {
          e.preventDefault();
          this.props.hMenuOpen(this.props.vari_index)
        }}
      >
        <div className="variItemText">
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
        <div className="variItemButton">
          <button className="iconButton variItemMoreButton"  
            onClick={e => {
              e.stopPropagation();
              this.props.hMenuOpen(this.props.vari_index)
            }}>
          more_vert</button>
        </div>
      </div>
    )
  }
}

export default VariItem
