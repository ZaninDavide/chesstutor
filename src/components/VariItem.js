import React, { Component } from "react"
import { Link } from "react-router-dom"
import Translator from "./Translator"
import Ripples from "react-ripples"

class VariItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuVisible: false,
    }
    this.rightClick = this.rightClick.bind(this);
    this.menuRef = React.createRef();
  }

  
  rightClick(e){
    e.preventDefault() /* avoids the menu to open */
    /* this.props.hMenuOpen(this.props.vari_index) */
    this.setState({menuVisible: true})
    this.menuRef.current.focus()
    return false /* avoids the menu to open */
  }

  render() {
    const thisVari = this.props.vari
    return (
        <Ripples 
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
          <div 
            className={"variItemMenu" + (this.state.menuVisible ? " variItemMenuOpened" : " variItemMenuClosed")}
            onClick={() => {this.setState({menuVisible: false})}}
            onBlur={() => this.setState({menuVisible: false})}
            tabindex="1"
            ref={this.menuRef}
          >
            <span className="variItemMenuIcon iconText" 
              onClick={() => {this.props.delete(); this.setState({menuVisible: false})}}
            >delete</span>
            <span className="variItemMenuIcon iconText" 
              onClick={() => {this.props.switch_archive(); this.setState({menuVisible: false})}}
            >{this.props.archived ? "unarchive" : "archive"}</span>
            <span className="variItemMenuIcon iconText" 
              onClick={() => {this.props.rename(); this.setState({menuVisible: false})}}
            >edit</span>
          </div>
        </Ripples>
      )
  }
}

export default VariItem
