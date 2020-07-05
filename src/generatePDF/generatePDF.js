import Chess from "../chessjs-chesstutor/chess.js"
import { get_piece_src, printBoardSVG } from "../utilities/file_paths"

import { make_san_nicer, process_comment } from "../utilities/san_parsing"
import { pieces_names } from "../utilities/pieces_and_coords"

let max_inline_comment_length = 35

let start = (text_size = "large", title_size = "Large") => `
<div id="sheet">
`

let end = () => `
<p id="watermarkPDF">Made with chessUp - Repertoire trainer</p>
</div>
`

let intro = (op_name, intro_text) => {
    return `<h2 id="introTitle">${op_name}</h2><p id="introText">${process_comment(intro_text)}</p>`
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
        text += make_san_nicer(move.san) + " " 
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
                let type = pieces_names[piece.color === "b" ? piece.type : piece.type.toUpperCase()] // get the type in this form: "white_king"
                let px = op_color === "black" ? ((7 - collumn) * 100) : (collumn * 100)
                let py = op_color === "black" ? ((7 - line) * 100) : (line * 100)
                piecesHTML += `<img src="${get_piece_src(type)}" class="piecePDF" style="transform: translate(${px}%, ${py}%" />` //${cellCoords[(collumn * 100).toString() + "x"] + cellCoords[(line * 100).toString() + "y"]}
            }
        }
    }

    let boardHTML = `<div class='boardContainerPDF'><div class="boardGridPDF">${piecesHTML}<img class='boardSVG_PDF' src='${printBoardSVG}'/></div></div>`
    return boardHTML
}

let comment = text => {
    return `<p class="commentPDF">${process_comment(text)}</p>` // \subsubsection*{\large{1. e4 - c5 2. \knight f6}}
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