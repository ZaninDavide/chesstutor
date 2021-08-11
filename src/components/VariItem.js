import React, { Component } from "react"
import Translator from "./Translator"
import Ripples from "react-ripples"
import { Menu, MenuItem } from '@szhsin/react-menu'

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

  parse_moves_list_html(moves){
    let moves_parsed = []
    moves.forEach((move, i) => {
        if(i % 2 === 0){
            // white's move
            moves_parsed.push(
                <span className="parsed_moves_number">{(Math.floor(i / 2) + 1).toString() + ". "}</span>
            )
        }
        moves_parsed.push(
          <span className="parsed_moves_san">{move.san}{(i !== moves.length -1 ? <>&nbsp;</> : "")}</span>
        )
    })
    return moves_parsed
  }

  render() {
    const thisVari = this.props.vari

    const moves_count = thisVari.moves.length === 0 ? 0 : Math.floor(thisVari.moves.length / 2) + 1
    const move_label = thisVari.moves.length === 1 || thisVari.moves.length === 2 ? "move" : "moves"

    return (
      <Ripples
        className={"variItem" + (thisVari.vari_subname ? " subvariItem" : "")}
        /*onContextMenu={this.rightClick}*/
        onClick={this.openVariation}
      >
        <div className="variItemText">
          <div className="variItemContent">
            <h2>
              {thisVari.vari_name}
              {thisVari.vari_subname && <>&nbsp;<span>{thisVari.vari_subname}</span></>}
            </h2>
            <p className="smallText">
              {moves_count}&nbsp;<Translator text={move_label}/>
            </p>
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
