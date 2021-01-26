import React, { Component } from "react"
import Translator from "./Translator"
import Ripples from "react-ripples"

// import { Menu, MenuItem } from '@szhsin/react-menu';

class VariItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuVisible: false,
    }
    this.rightClick = this.rightClick.bind(this);
    this.menuButtonClick = this.menuButtonClick.bind(this);
    this.openVariation = this.openVariation.bind(this);
    this.menuRef = React.createRef();
  }

  menuButtonClick(e) {
    e.stopPropagation()
    this.setState({ menuVisible: true })
    this.menuRef.current.focus()
  }

  rightClick(e) {
    this.setState({ menuVisible: true })
    this.menuRef.current.focus()

    /* avoids the menu to open */
    e.preventDefault()
    return false
  }

  openVariation() {
    this.props.history.push("/openings/" + this.props.op_index + "/" + this.props.vari_index)
  }

  render() {
    const thisVari = this.props.vari
    return (
      <Ripples
        className={"variItem" + (thisVari.vari_subname ? " subvariItem" : "")}
        onContextMenu={this.rightClick}
        onClick={this.openVariation}
      >
        <div className="variItemText">
          <div className="variItemContent">
            {(() => {
              if (thisVari.vari_subname) {
                return <h2>{thisVari.vari_name + " "}<span className="impText">{thisVari.vari_subname}</span></h2>
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
        <div className="variItemButton iconText" onClick={this.menuButtonClick}>
          more_vert
        </div>

        <div
          className={"variItemMenu" + (this.state.menuVisible ? " variItemMenuOpened" : " variItemMenuClosed")}
          onClick={e => {
            this.setState({ menuVisible: false });
            e.stopPropagation()
          }}
          onBlur={() => this.setState({ menuVisible: false })}
          tabIndex="1"
          ref={this.menuRef}
        >
          <span className="variItemMenuButton"
            onClick={() => { this.props.delete(); this.setState({ menuVisible: false }) }}
          ><span className="iconText">delete</span><span className="variItemMenuLabel">delete</span></span>
          {/*
          <span className="variItemMenuButton"
            onClick={() => { this.props.switch_archive(); this.setState({ menuVisible: false }) }}
          ><span className="iconText">{this.props.archived ? "unarchive" : "archive"}</span><span className="variItemMenuLabel">{this.props.archived ? "unarchive" : "archive"}</span></span>
          */}
          <span className="variItemMenuButton"
            onClick={() => { this.props.rename(); this.setState({ menuVisible: false }) }}
          ><span className="iconText">edit</span><span className="variItemMenuLabel">Move / Rename</span></span>
        </div>


        {/*
        <div className="variItemButton iconText" onClick={e => e.stopPropagation()}>
          <Menu menuButton={
            <button className="iconButton">more_vert</button>}>
            <MenuItem ><Translator text="Rename\Move" /></MenuItem>
            <MenuItem ><Translator text="Archive" /></MenuItem>
            <MenuItem ><Translator text="Delete" /></MenuItem>
          </Menu>
        </div>
        */}
      </Ripples>
    )
  }
}

export default VariItem
