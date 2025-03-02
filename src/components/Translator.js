import React, { useContext } from "react"
import { LanguageContext } from "./LanguageContext"

const languages = {
  eng: {
    Openings: "Openings",
    white: "white",
    black: "black",
    White: "White",
    Black: "Black",
    variation: "line",
    variations: "lines",
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
    "No openings yet!": "No openings yet!",
    "New variation name": "New line's name",
    "New variation": "New line",
    no_openings: "No openings yet! Use the + button in the right bottom corner to create a new one.",
    no_variations: "No variations yet! Use the + button in the right bottom corner to create a new one.",
    Training: "Training",
    Comments: "Comments",
    "Archived openings": "Archive",
    "Archived variations": "Archived lines",
    "Delete permanently:": "Delete permanently:",
    "Rename": "Rename",
    "to:": "to:",
    "Name": "Name",
    "Language": "Language",
    "white openings": "white openings",
    "black openings": "black openings",
    "Send": "Share",
    "to": "to",
    "with": "with",
    "draw_board_pdf": "Show position",
    "Log out": "Log out",
    "Advanced": "Advanced settings",
    "Inbox": "Shared with you",
    "Settings": "Settings",
    "General": "General",
    "BOARD": "BOARD",
    "Congrats": "Congrats! Training finished",
    "Opening downloaded": "Opening added to your repertoire.",
    "Choose a name for this group of variations": "Choose a name for this group of lines",
    "Analysis": "Analysis",
    "Delete": "Delete",
    "Archive": "Archive",
    "Print PDF": "Print PDF",
    "Extra Features": "Extra Features",
    "Computer waits before moving": "Delay in computer's answer",
    "Free analysis": "Free analysis",
    "Color theme": "Color theme",
    "Messages": "Shared with you",
    "Precision (depth)": "Analysis depth",
    "Open on lichess.org": "Open on lichess.org",
    "Open on chess.com": "Open on chess.com",
    "group": "group",
    "": "",
    null: "",
    "Board": "Board",
    "Unarchive": "Unarchive",
    "Flip": "Flip",
    "Analyze position": "Analyze position",
    "Dark": "Dark",
    "Light": "Light",
    "Off": "Off",
    "Low": "Low",
    "Medium": "Medium",
    "High": "High",
    "Move": "Move",
    "Opening": "Opening",
    "Line": "Line",
    "FAST": "FAST",
    "GOOD": "GOOD",
    "PRECISE": "PRECISE",
    "ACCURATE": "ACCURATE",
    "DEEPER": "DEEPER",
    "Book": "Book",
    "Repertoire": "Repertoire",
    "Small board": "Small board",
    "Large board": "Large board",
    "You just trained on": "You just trained on",
    "Daily training": "Daily training",
    "Lines to revise today": "Lines to revise today",
    "It's okay. Find another good move.": "It's okay. Find another good move.",
    "You don't need to train any more for today.": "You don't need to train any more for today.",
    "discard_mail": "Are you sure you want to delete this message? You will no longer be able to download the content.",
    "Show position evaluation": "Show position evaluation",
    "Show best move": "Show best move",
    "In-cloud analysis": "In-cloud analysis (lichess.org)",
    "Dataset": "Dataset",
    "My repertoire": "My repertoire",
    "Masters games": "Masters games",
    "Auto": "Auto",
    "Volume": "Volume",
    "Chess Notation": "Chess Notation",
    "Masters": "Masters",
    "Games": "Games",
    "Winrate WDB": "Winrate WDB",
    "Start training": "Start training",
    "Group name": "Group name",
    "all moves": "all moves",
    "Review depth": "Review depth",
    "Targeted daily effort": "Targeted daily effort",
    "Current score": "Current score",
    "Load PGN": "Load PGN",
    "Add from PGN": "Add from PGN",
    "Download database": "Download your data",
    "Copy PGN": "Copy PGN",
    "Copy FEN": "Copy FEN",
    "Load lines from PGN": "Load lines from PGN",
    "was successfully added to your repertoire!": "was successfully added to your repertoire!",
    "was successfully updated!": "was successfully updated!",
    "January": "January",
    "February": "February",
    "March": "March",
    "April": "April",
    "May": "May",
    "June": "June",
    "July": "July",
    "August": "August",
    "September": "September",
    "October": "October",
    "November": "November",
    "December": "December",
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
    "No openings yet!": "La tua lista aperture è vuota!",
    "New variation name": "Nome della nuova variante",
    "New variation": "Nuova variante",
    no_openings: "Non hai ancora aperture! Usa il pulsante + in basso a destra per crearne una nuova.",
    no_variations: "Non hai ancora varianti in questa apertura! Usa il pulsante + in basso a destra per crearne una nuova.",
    Training: "Allenamento",
    Comments: "Commento",
    "Archived openings": "Archivio",
    "Archived variations": "Varianti archiviate",
    "Delete permanently:": "Eliminare definitivamente:",
    "Rename": "Rinomina",
    "to:": "come:",
    "Name": "Nome",
    "Language": "Lingua ⋅ Language",
    "white openings": "aperture del bianco",
    "black openings": "aperture del nero",
    "Send": "Condividi",
    "to": "a",
    "with": "con",
    "draw_board_pdf": "Mostra posizione",
    "Log out": "Disconnetti",
    "Advanced": "Impostazioni avanzate",
    "Inbox": "Condivisi con te",
    "Settings": "Impostazioni",
    "General": "Generale",
    "BOARD": "SCACCHIERA",
    "Congrats": "Complimenti! Allenamento completato",
    "Opening downloaded": "Apertura aggiunta al repertorio.",
    "Choose a name for this group of variations": "Scegli un nome per questo gruppo di varianti",
    "Analysis": "Analisi",
    "Delete": "Elimina",
    "Archive": "Archivia",
    "Print PDF": "Stampa PDF",
    "Extra Features": "Funzionalità Aggiuntive",
    "Computer waits before moving": "Ritardo nella riposta del computer",
    "Free analysis": "Analisi libera",
    "Color theme": "Tema colori",
    "Messages": "Condivisi con te",
    "Precision (depth)": "Profondità analisi",
    "Open on lichess.org": "Apri con lichess.org",
    "Open on chess.com": "Apri con chess.com",
    "group": "gruppo",
    "": "",
    null: "",
    "Board": "Scacchiera",
    "Unarchive": "Estrai dall'archivio",
    "Flip": "Ruota",
    "Analyze position": "Analizza posizione",
    "Dark": "Scuro",
    "Light": "Chiaro",
    "Off": "Muto",
    "Low": "Basso",
    "Medium": "Medio",
    "High": "Alto",
    "Move": "Mossa",
    "Opening": "Apertura",
    "Line": "Variante",
    "FAST": "Rapido",
    "GOOD": "Buono",
    "PRECISE": "Preciso",
    "ACCURATE": "Accurato",
    "DEEPER": "Approfondito",
    "Book": "Libro",
    "Repertoire": "Repertorio",
    "Small board": "Scacchiera piccola",
    "Large board": "Scacchiera grande",
    "You just trained on": "Ti sei allenato su",
    "Daily training": "Ripasso giornaliero",
    "Lines to revise today": "Varianti da ripassare oggi",
    "It's okay. Find another good move.": "Va bene. Trova un'alternativa.",
    "You don't need to train any more for today.": "Per oggi hai finito, non serve che ti alleni ulteriormente.",
    "discard_mail": "Sei sicuro di voler eliminare questo messaggio? Non potrai più scaricare l'apertura.",
    "Show position evaluation": "Valuta posizione",
    "Show best move": "Mostra la mossa migliore",
    "In-cloud analysis": "Analisi nel cloud (lichess.org)",
    "Dataset": "Dati",
    "My repertoire": "Il mio repertorio",
    "Masters games": "Partite di maestri",
    "Auto": "Auto",
    "Volume": "Volume",
    "Chess Notation": "Notazione",
    "Masters": "Maestri",
    "Games": "Partire",
    "Winrate WDB": "Vittorie BPN",
    "Start training": "Inizia l'allenamento",
    "Group name": "Nome del gruppo",
    "all moves": "tutte le mosse",
    "Review depth": "Profondità del ripasso",
    "Targeted daily effort": "Obiettivo giornaliero",
    "Current score": "Punteggio",
    "Load PGN": "Carica PGN",
    "Add from PGN": "Aggiungi da PGN",
    "Download database": "Scarica i tuoi dati",
    "Copy PGN": "Copia PGN",
    "Copy FEN": "Copia FEN",
    "Load lines from PGN": "Carica varianti da PGN",
    "was successfully added to your repertoire!": "è stata aggiunta al repertorio!",
    "was successfully updated!": "è stata aggiornata!",
    "January": "Gennaio",
    "February": "Febbraio",
    "March": "Marzo",
    "April": "Aprile",
    "May": "Maggio",
    "June": "Giugno",
    "July": "Luglio",
    "August": "Agosto",
    "September": "Settembre",
    "October": "Ottobre",
    "November": "Novembre",
    "December": "Dicembre",
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
