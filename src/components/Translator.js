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
    "New opening": "New opening",
    Login: "Login",
    Username: "Username",
    Password: "Password",
    "Remember me": "Remember me",
    "Sign up": "Sign up",
    "No openings yet!" : "No openings yet!",
    "New variation name" : "New variation name",
    "New variation" : "New variation",
    no_openings: "No openings yet! Use the + button in the right bottom corner to create a new one.",
    no_variations: "No variations yet! Use the + button in the right bottom corner to create a new one.",
    Training: "Training",
    Comments: "Comments",
    "Archived openings": "Archived openings",
    "Archived variations": "Archived variations",
    "Delete permanently:": "Delete permanently:",
    "Rename": "Rename",
    "to:": "to:",
    "Name": "Name",
    "Language": "Language",
    "white openings": "white openings",
    "black openings": "black openings",
    "Send": "Send",
    "to": "to",
    "with": "with",
    "draw_board_pdf": "Draw position in PDF",
    "Log out": "Log out",
    "Profile": "Profile",
    "Inbox": "Inbox",
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
    "New opening": "Nuova apertura",
    Login: "Accedi",
    Username: "Nome utente",
    Password: "Password",
    "Remember me": "Ricordami",
    "Sign up": "Iscriviti",
    "No openings yet!" : "La tua lista aperture è vuota!",
    "New variation name" : "Nome della nuova variante",
    "New variation" : "Nuova variante",
    no_openings: "Non hai ancora aperture! Usa il pulsante + in basso a destra per crearne una nuova.",
    no_variations: "Non hai ancora varianti in questa apertura! Usa il pulsante + in basso a destra per crearne una nuova.",
    Training: "Allenamento",
    Comments: "Commento",
    "Archived openings": "Aperture archiviate",
    "Archived variations": "Varianti archiviate",
    "Delete permanently:": "Eliminare definitivamente:",
    "Rename": "Rinominare",
    "to:": "come:",
    "Name": "Nome",
    "Language": "Lingua(Language)",
    "white openings": "aperture del bianco",
    "black openings": "aperture del nero",
    "Send": "Condividi",
    "to": "a",
    "with": "con",
    "draw_board_pdf": "Disegna posizione sul PDF",
    "Log out": "Disconnetti",
    "Profile": "Profilo",
    "Inbox": "Posta",
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
  return languages[lang][props.text]
}

export default Translator
