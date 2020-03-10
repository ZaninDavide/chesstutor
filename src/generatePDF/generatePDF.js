import Chess from "../chessjs-chesstutor/chess.js"
const printBoardSVG = "/files/chessboard_print.svg"
// const printBoardRotatedSVG = "/files/chessboard_print_rotated.svg"
const whiteKingSVG = "/files/white_king.svg"
const whiteQueenSVG = "/files/white_queen.svg"
const whiteRookSVG = "/files/white_rook.svg"
const whiteKnightSVG = "/files/white_knight.svg"
const whitePawnSVG = "/files/white_pawn.svg"
const whiteBishopSVG = "/files/white_bishop.svg"
const blackKingSVG = "/files/black_king.svg"
const blackQueenSVG = "/files/black_queen.svg"
const blackRookSVG = "/files/black_rook.svg"
const blackKnightSVG = "/files/black_knight.svg"
const blackPawnSVG = "/files/black_pawn.svg"
const blackBishopSVG = "/files/black_bishop.svg"

let max_inline_comment_length = 35

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

const piecesName = {
    K: "white_king",
    Q: "white_queen",
    R: "white_rook",
    N: "white_knight",
    B: "white_bishop",
    P: "white_pawn",
    k: "black_king",
    q: "black_queen",
    r: "black_rook",
    n: "black_knight",
    b: "black_bishop",
    p: "black_pawn"
}

let getPieceSrc = (name) => {
    switch (name) {
      case "white_king":
        return whiteKingSVG
      case "white_queen":
        return whiteQueenSVG
      case "white_rook":
        return whiteRookSVG
      case "white_bishop":
        return whiteBishopSVG
      case "white_knight":
        return whiteKnightSVG
      case "white_pawn":
        return whitePawnSVG
      case "black_king":
        return blackKingSVG
      case "black_queen":
        return blackQueenSVG
      case "black_rook":
        return blackRookSVG
      case "black_bishop":
        return blackBishopSVG
      case "black_knight":
        return blackKnightSVG
      case "black_pawn":
        return blackPawnSVG
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

let canCommentBeInline = comment => {
    if(comment){
        return comment.length <= max_inline_comment_length && comment.indexOf("\n") === -1
    }else{
        return false
    }
}

let line_moves = (moves_array, last_index, discussed_count) => {
    let index = last_index - (moves_array.length - 1)
    let text = ""

    let discussed = true

    moves_array.forEach((cur, offset) => {
        let move = cur[0]
        let comment = cur[1]
        if(discussed_count === offset){
            text += "<b>"
            discussed = false
        }
        let final_index = index + offset
        if(final_index % 2 === 0){
            text += (Math.floor(final_index / 2) + 1).toString() + ". "
        }
        text += nicer_san(move.san) + " " 
        // inline comments
        if(!discussed && comment){
            if(canCommentBeInline(comment)){
                text += "<i class='inlineCommentPDF'>" + comment + "</i>&nbsp;"
            }
        }
    })

    if(discussed_count !== moves_array.length){
        text += "</b>"
    }

    return `<p class="lineMoves">${text}</p>`
}

let boardFromMoveName = (move_name, op_color) => {
    // generate fen
    let game = new Chess()
    move_name.split("|").forEach(san => {
        if(san){
            game.move(san)
        }
    })
    let piecesHTML = ""   
    let board = game.board()
    for (let line = 0; line < 8; line++) {
        for (let collumn = 0; collumn < 8; collumn++) {
        // get the piece from the array
        let piece = board[line][collumn]
            if (piece !== null) {
                // if the cell is not empty
                let type = piecesName[piece.color === "b" ? piece.type : piece.type.toUpperCase()] // get the type in this form: "white_king"
                let px = op_color === "black" ? ((7 - collumn) * 100) : (collumn * 100)
                let py = op_color === "black" ? ((7 - line) * 100) : (line * 100)
                piecesHTML += `<img src="${getPieceSrc(type)}" class="piecePDF" style="transform: translate(${px}%, ${py}%" />` //${cellCoords[(collumn * 100).toString() + "x"] + cellCoords[(line * 100).toString() + "y"]}
            }
        }
    }

    let boardHTML = `<div class='boardContainerPDF'><div class="boardGridPDF">${piecesHTML}<img class='boardSVG_PDF' src='${printBoardSVG}'/></div></div>`
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
                let move_name = moveName(vari.moves.slice(0, index + 1))
                // add this move to the stack of moves to draw on one line
                one_line_moves.push([move, op.comments[move_name]])

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
                        if(!canCommentBeInline(op.comments[move_name])){
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
            html += boardFromMoveName(b[1], op.op_color) 
        }
        if(b[0] === "comment"){
            html += comment(op.comments[b[1]]) 
        }
    })

    let final_html = start() + html + end()
    return final_html
}

export default generatePDF