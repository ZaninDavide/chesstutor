import React, { Component } from "react"
import Translator from "./Translator"
import Ripples from "react-ripples"
import { Menu, MenuItem } from '@szhsin/react-menu';

class VariItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuVisible: false,
    }
    this.rightClick = this.rightClick.bind(this);
    this.menuButtonClick = this.menuButtonClick.bind(this);
    this.openVariation = this.openVariation.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    //this.menuRef = React.createRef();
  }

  menuButtonClick(e) {
    e.stopPropagation()
    this.setState({ menuVisible: true })
    //this.menuRef.current.focus()
  }

  rightClick(e) {
    this.setState({ menuVisible: true })
    //this.menuRef.current.focus()

    /* avoids the menu to open */
    e.preventDefault()
    return false
  }

  openVariation() {
    this.props.history.push("/openings/" + this.props.op_index + "/" + this.props.vari_index)
  }

  closeMenu() {
    this.setState({ menuVisible: false })
  }

  render() {
    const thisVari = this.props.vari
    return (
      <Ripples
        className={"variItem" + (thisVari.vari_subname ? " subvariItem" : "")}
        /*onContextMenu={this.rightClick}*/
        onClick={this.openVariation}
      >
        <div className="variItemText">
          <div className="variItemContent">
            {(() => {
              if (thisVari.vari_subname) {
                return <h2>{thisVari.vari_name + " "}<span>{thisVari.vari_subname}</span></h2>
              } else {
                return <h2>{thisVari.vari_name}</h2>
              }
            })()}
            {<p className="smallText">
              {Math.floor(thisVari.moves.length / 2) + 1}&nbsp;<Translator text={thisVari.moves.length === 1 || thisVari.moves.length === 2 ? "move" : "moves"} />
            </p>}
          </div>
        </div>

        {/* MENU */}
        <div className="variItemButton iconText" onClick={e => e.stopPropagation()}>
          <Menu menuButton={
              <div className="variItemButton iconText" onClick={this.menuButtonClick} onBlur={this.closeMenu}>
                more_vert
              </div>
            }
          >
            <MenuItem onClick={this.props.delete} className="alertText"><span className="iconText variItemMenuIcon">delete</span><Translator text="Delete" /></MenuItem>
            <MenuItem onClick={this.props.rename}><span className="iconText variItemMenuIcon">edit</span><Translator text="Rename" /></MenuItem>
          </Menu>
        </div>
      </Ripples>
    )
  }
}

export default VariItem
