import React, { useContext } from "react"
import { LanguageContext } from "./LanguageContext"

const languages = {
  eng: {
    Openings: "Openings",
    white: "white",
    black: "black",
    White: "White",
    Black: "Black",
    variation: "variation",
    variations: "variations",
    move: "move",
    moves: "moves",
    "Opening name": "Opening name",
    "Study as": "Study as",
    Create: "Create",
    "New opening": "New opening"
  },
  ita: {
    Openings: "Aperture",
    white: "bianco",
    black: "nero",
    White: "Bianco",
    Black: "Nero",
    variation: "variante",
    variations: "varianti",
    move: "mossa",
    moves: "mosse",
    "Opening name": "Nome apertura",
    "Study as": "Studia come",
    Create: "Crea",
    "New opening": "Nuova apertura"
  }
}

const Translator = props => {
  let lang = useContext(LanguageContext).lang
  if (languages[lang] === undefined) {
    console.log("Translator: unknown language: '" + lang + "'. Translated instead to english")
    lang = "eng"
  }
  if (languages[lang][props.text] === undefined) {
    console.log("Translator: missing '" + props.text + "' in '" + lang + "'")
    return <React.Fragment>{props.text}</React.Fragment>
  }
  return <React.Fragment>{languages[lang][props.text]}</React.Fragment>
}

export default Translator
