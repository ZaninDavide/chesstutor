import React from "react"
import { Link } from "react-router-dom"

const Header = props => {
  return (
    <div id="header">
      <Link to="/" id="home_button" className="iconButton">
        home
      </Link>
      <h1 id="title">{props.title}</h1>
      <p id="headerChessTutorLabel">chesstutor</p>
    </div>
  )
}

export default Header
