import React from "react"
import { Link } from "react-router-dom"

const Header = props => {

  const headerButton = () => {
    if(props.headerButtonContent !== undefined){
      return <button id="headerButton" className="importantButton" onClick={props.headerButtonClick}>{props.headerButtonContent}</button>
    }
  }

  return (
    <div id="header">
      <div id="headerLeftSide">
        <Link to={props.goTo !== undefined ? props.goTo : "/home"} id="home_button" className="iconButton">
          {props.mainButtonText !== undefined ? props.mainButtonText : "home"}
        </Link>
        <h1 id="title">{props.title}</h1>
        <p id="headerChessTutorLabel">{/*chesstutor*/}</p>
      </div>
      <div id="headerRightSide">
        {headerButton()}
      </div>
    </div>
  )
}

export default Header
