import React from "react"
import { Link } from "react-router-dom"

import { Menu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

const Header = props => {

  return (
    <div id="header">
      <div id="headerLeftSide">
        {props.goTo !== undefined || props.mainButtonText !== undefined ?
          <Link to={props.goTo !== undefined ? props.goTo : "/"} id="home_button" className="iconButton">
            {props.mainButtonText !== undefined ? props.mainButtonText : "home"}
          </Link> : <span style={{ width: "var(--mediumMargin)" }}></span>
        }
        <h1 id="title">{props.title}</h1>
        <p id="headerChessTutorLabel">{/*chesstutor*/}</p>
      </div>
      <div id="headerRightSide">
        {props.headerMenu}
      </div>
    </div>
  )
}

export default Header
