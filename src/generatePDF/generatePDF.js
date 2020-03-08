import Chess from "../chessjs-chesstutor/chess.js"
const printBoardSVG = "/files/chessboard_print.svg"

let start = (text_size = "large", title_size = "Large") => `
<div id="sheet">
`

let end = () => `
<p id="watermarkPDF">Made with chessUp - Repertoire trainer</p>
</div>
`

let getPieceText = name => {
    switch (name) {
      case "white_king":
        return "♔"
      case "white_queen":
        return "♕"
      case "white_rook":
        return "♖"
      case "white_bishop":
        return "♗"
      case "white_knight":
        return "♘"
      case "white_pawn":
        return "♙"
      case "black_king":
        return "♚"
      case "black_queen":
        return "♛"
      case "black_rook":
        return "♜"
      case "black_bishop":
        return "♝"
      case "black_knight":
        return "♞"
      case "black_pawn":
        return "♟"
      default:
        return undefined
    }
}

let nicer_san= (san) => {
    let text = san
    text = text.replace("Q", getPieceText("white_queen"))
    text = text.replace("K", getPieceText("white_king"))
    text = text.replace("N", getPieceText("white_knight"))
    text = text.replace("B", getPieceText("white_bishop"))
    text = text.replace("R", getPieceText("white_rook"))
    text = text.replace("P", getPieceText("white_pawn"))
    return text
}

let escapeHtml = text => {
    if(text === undefined) return ""
    return text
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

let processComment = comment_text => {
    let text = escapeHtml(comment_text)

    const regex_bold = /\*(.*?)\*/gm;
    const subst_bold = `<b>$1</b>`;
    let mark_down_text = text ? text.replace(regex_bold, subst_bold) : "";

    const regex_line = /_(.*?)_/gm;
    const subst_line = `<u>$1</u>`;
    mark_down_text = mark_down_text ? mark_down_text.replace(regex_line, subst_line) : "";

    /* MAKE MOVES LOOK NICER */
    mark_down_text = mark_down_text.replace("$$Q", getPieceText("black_queen"))
    mark_down_text = mark_down_text.replace("$$K", getPieceText("black_king"))
    mark_down_text = mark_down_text.replace("$$N", getPieceText("black_knight"))
    mark_down_text = mark_down_text.replace("$$B", getPieceText("black_bishop"))
    mark_down_text = mark_down_text.replace("$$R", getPieceText("black_rook"))
    mark_down_text = mark_down_text.replace("$$P", getPieceText("black_pawn"))

    mark_down_text = mark_down_text.replace("$Q", getPieceText("white_queen"))
    mark_down_text = mark_down_text.replace("$K", getPieceText("white_king"))
    mark_down_text = mark_down_text.replace("$N", getPieceText("white_knight"))
    mark_down_text = mark_down_text.replace("$B", getPieceText("white_bishop"))
    mark_down_text = mark_down_text.replace("$R", getPieceText("white_rook"))
    mark_down_text = mark_down_text.replace("$P", getPieceText("white_pawn"))

    return mark_down_text
}

let intro = (op_name, intro_text) => {
    return `<h2 id="introTitle">${op_name}</h2><p id="introText">${processComment(intro_text)}</p>`
}

let variTitle = vari_name => `<h3 class="variTitle">${vari_name}</h3>`

let line_moves = (moves_array, last_index, discussed_count) => {
    let index = last_index - (moves_array.length - 1)
    let text = ""

    moves_array.forEach((move, offset) => {
        if(discussed_count === offset){
            text += "<b>"
        }
        let final_index = index + offset
        if(final_index % 2 === 0){
            text += (Math.floor(final_index / 2) + 1).toString() + ". "
        }
        text += nicer_san(move.san) + " " 
    })

    if(discussed_count !== moves_array.length){
        text += "</b>"
    }

    return `<p class="lineMoves">${text}</p>`
}

let boardFromMoveName = move_name => {
    // generate fen
    let game = new Chess()
    move_name.split("|").forEach(san => {
        if(san){
            game.move(san)
        }
    })
    let boardHTML = `<div class='boardContainerPDF'><img class='boardSVG_PDF' src='${printBoardSVG}'/></div>`
    return boardHTML
}

let comment = text => {
    return `<p class="commentPDF">${processComment(text)}</p>` // \subsubsection*{\large{1. e4 - c5 2. \knight f6}}
}

let moveName = json_moves => {
    let str = "|"
    json_moves.forEach(elem => {
      str += elem.san + "|"
    });
    return str
}

let generatePDF = function (op, settings){
    let html = ""
    let movesAdded = [] // here i store all the moves names that where already discussed

    // the opening written as key blocks
    let blocks = []

    // add intro if written
    html += intro(op.op_name, op.comments["|"] || "")
    
    op.variations.forEach((vari, id) => {
        if(!vari.archived){
            // add the title if the variation
            blocks.push([
                "variTitle", vari.vari_name
            ])

            let one_line_moves = []
            let one_line_moves_discussed_count = 0
            
            vari.moves.forEach((move, index) => {
                // add this move to the stack of moves to draw on one line
                one_line_moves.push(move)

                let move_name = moveName(vari.moves.slice(0, index + 1))
                if(movesAdded.indexOf(move_name) === -1){ // if move not discussed already
                    // sign this as already discussed move
                    movesAdded.push(move_name)
                    if(op.pdfBoards[move_name]){ 
                        // stop stacking moves on one line
                        blocks.push([
                            "line_moves", one_line_moves, index, one_line_moves_discussed_count
                        ])
                        // restart stacking moves on one line
                        one_line_moves = []
                        one_line_moves_discussed_count = 0
                        // draw this board position here
                        blocks.push([
                            "board", move_name
                        ])
                    }
                    if(op.comments[move_name]){
                        // stop stacking moves on one line
                        if(one_line_moves.length > 0){
                            blocks.push([
                                "line_moves", one_line_moves, index, one_line_moves_discussed_count
                            ])
                            // restart stacking moves on one line
                            one_line_moves = []
                            one_line_moves_discussed_count = 0
                        }
                        // write this comment here
                        blocks.push([
                            "comment", move_name
                        ])
                    }
                }else{
                    // this move was already discussed
                    one_line_moves_discussed_count += 1
                }
            })
            
            if(one_line_moves.length > 0){
                blocks.push([
                    "line_moves", one_line_moves, vari.moves.length - 1, one_line_moves_discussed_count
                ])
                // restart stacking moves on one line
                one_line_moves = []
                one_line_moves_discussed_count = 0
            }
        }
    })

    // turn blocks into html
    blocks.forEach(b => {
        if(b[0] === "variTitle"){
            html += variTitle(b[1]) 
        }
        if(b[0] === "line_moves"){
            html += line_moves(b[1], b[2], b[3]) 
        }
        if(b[0] === "board"){
            html += boardFromMoveName(b[1]) 
        }
        if(b[0] === "comment"){
            html += comment(op.comments[b[1]]) 
        }
    })

    let final_html = start() + html + end()
    return final_html
}

export default generatePDF