import Chess from "../chessjs_custom/chess.js"
import { get_piece_src, printBoardSVG } from "../utilities/file_paths"

import { make_san_nicer_html, process_comment } from "../utilities/san_parsing"
import { pieces_names } from "../utilities/pieces_and_coords"

let max_inline_comment_length = 50

let start = () => `
<div id="sheet">
`

let end = () => `
</div>
`

let intro = (op_name, intro_text = "") => {
    return `<h1 id="introTitle">${op_name}</h1><p id="introText">${process_comment(intro_text)}</p>`
}

let group_title = vari_name => `<h2 class="variTitle">${vari_name}</h2>`

let can_be_inline_comment = comment => {
    if(comment){
        return comment.length <= max_inline_comment_length && comment.indexOf("\n") === -1
    }else{
        return false
    }
}

/*
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
        text += make_san_nicer_html(move.san) + " " 
        // inline comments
        if(!discussed && comment){
            if(can_be_inline_comment(comment)){
                text += "<i class='inlineCommentPDF'>" + comment + "</i>&nbsp;"
            }
        }
    })

    if(discussed_count !== moves_array.length){
        text += "</b>"
    }

    return `<p class="lineMoves">${text}</p>`
}
*/

let board_from_sans = (sans, side) => {
    // generate fen
    let game = new Chess()
    let moves_count = 0
    sans.split("|").forEach(san => {
        if(san){
            game.move(san)
            moves_count++
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
                let px = side === "black" ? ((7 - collumn) * 100) : (collumn * 100)
                let py = side === "black" ? ((7 - line) * 100) : (line * 100)
                piecesHTML += `<img src="${get_piece_src(type)}" class="piecePDF" style="transform: translate(${px}%, ${py}%" />` //${cellCoords[(collumn * 100).toString() + "x"] + cellCoords[(line * 100).toString() + "y"]}
            }
        }
    }

    let classes = "boardGridPDF"
    if(moves_count % 2 === 0) { classes += " white_to_move" } else { classes += " black_to_move" } 
    if(side === "black") classes += " flipped"
    let boardHTML = `<div class='boardContainerPDF'><div class="${classes}">${piecesHTML}<img class='boardSVG_PDF' src='${printBoardSVG}'/></div></div>`
    return boardHTML
}

// let comment = text => {
//     return `<p class="commentPDF">${process_comment(text)}</p>` // \subsubsection*{\large{1. e4 - c5 2. \knight f6}}
// }

function varis_to_tree(varis, comments, boards, op_color) {
    let tree = { moves: [], comment: "" }
    let cursor = tree

    varis.forEach(vari => {
        cursor = tree
        let sans = "|"
        vari.moves.forEach((move, index) => {
            sans += move.san + "|"
            let san_filter = cursor.moves.filter(m => m.san === move.san)
            if(san_filter.length > 0){
                // the tree already has this move
                cursor = san_filter[0]
            }else{
                // this is a new move
                let new_move = {}
                new_move.san = move.san
                new_move.sans = sans
                new_move.moves = []
                new_move.index = index
                new_move.board = boards[sans] ? { board: true, side: op_color } : { board: false }
                if(comments[sans]) new_move.comment = comments[sans]
                cursor.moves.push(new_move)
                cursor = cursor.moves[cursor.moves.length - 1]
            }
        })
    })

    return tree
}

function is_short_mono_line(node, max_length = 4) {
    let half_moves_couter = 0
    let not_allowed = false

    let navigate = function (move) {
        if(move.moves.length > 1) {
            not_allowed = true
        }else{
            if(!move.board.board && (!move.comment || can_be_inline_comment(move.comment))){
                half_moves_couter++
                if(move.moves.length !== 0) navigate(move.moves[0])
            }else{
                not_allowed = true
            }
        }
    }

    navigate(node)

    return half_moves_couter <= max_length && !not_allowed
}

function render_mono_line_html(node, need_ellipses) {
    let classes = "mono_line"
    if(need_ellipses) classes += " starter_mono_line"
    return `<span class="${classes}"><span class="mono_line_bracket_open"></span>${
        node_to_html(node, need_ellipses)
    }<span class="mono_line_bracket_close"></span></span>`
}

function node_to_html(node, need_ellipses = false) {
    let html = ""

    let move_number = Math.floor(node.index / 2) + 1
    let move_number_string = node.index % 2 === 0 ? `<span class="move_san_number">${move_number}.</span>` : ""
    let move_number_string_ellipses = node.index % 2 === 1 && need_ellipses ? `<span class="move_san_number">${move_number}...</span>` : ""

    let classes = "move_san_container"
    classes += need_ellipses ? " starter_move" : ""
    classes += move_number_string || move_number_string_ellipses ? " numbered_move" : ""
    classes += node.comment ? " inline_commented_move" : ""
    html = `<span class="${classes}">${move_number_string || move_number_string_ellipses}<span class="move_san">${make_san_nicer_html(node.san)}</span></span>`

    let next_move_needs_ellipses = false

    if(node.comment){
        if(can_be_inline_comment(node.comment)){
            // inline comment
            html += `<span class="pdf_inline_comment">${process_comment(node.comment)}</span>`
        }else{
            // large comment
            html += `<div class="pdf_comment">${process_comment(node.comment)}</div>`
            next_move_needs_ellipses = true
        }
    }

    if(node.board.board) {
        html += board_from_sans(node.sans, node.board.side)
        next_move_needs_ellipses = true;
    }

    let use_list = false

    if(node.moves.length === 1){
        html += node_to_html(node.moves[0], next_move_needs_ellipses)
    }else if(node.moves.length === 2){
        let option1 = node.moves[0]
        let option2 = node.moves[1]
        let is_short1 = is_short_mono_line(option1)
        let is_short2 = is_short_mono_line(option2)
        if(is_short1 && is_short2){
            if(option1.moves.length <= option2.moves.length){
                html += render_mono_line_html(option1, next_move_needs_ellipses)
                html += node_to_html(option2, next_move_needs_ellipses)
            }else{
                html += render_mono_line_html(option2, next_move_needs_ellipses)
                html += node_to_html(option1, next_move_needs_ellipses)
            }
        }else if(is_short1){
            html += render_mono_line_html(option1, next_move_needs_ellipses)
            html += node_to_html(option2, next_move_needs_ellipses)
        }else if(is_short2){
            html += render_mono_line_html(option2, next_move_needs_ellipses)
            html += node_to_html(option1, next_move_needs_ellipses)
        }else{
            use_list = true
        }
    }else if(node.moves.length > 2){
        use_list = true
    }

    if(use_list){
        // multiple moves
        let moves_html = node.moves.map(m => `<div class="pdf_node">${node_to_html(m, true)}</div>`)
        html += '<div class="moves_container">'
        html += moves_html.join("") // "<div style='height: 10px'></div>"
        html += "</div>"
    }

    return html
}

function group_to_html(group_name, varis, comments, boards, op_color) {
    let html = ""

    html += group_title(group_name)

    let tree = varis_to_tree(varis, comments, boards, op_color)

    html += tree.moves.map(m => node_to_html(m, true))
    

    return html;
}

function generate_pdf(op) {
    let html = ""
    
    html += intro(op.op_name, op.comments["|"])

    // i commenti non vanno MAI ripetuti due volte,
    // le mosse si possono ripetere tra gruppi di varianti ma non nello stesso gruppo,
    // un gruppo viene trattato come un albero di mosse

    let groups = {}

    op.variations.forEach(v => {
        if(groups[v.vari_name]) {
            groups[v.vari_name].push(v)
        }else{
            groups[v.vari_name] = [v]
        }
    })

    // let comments_displayed = []

    html += Object.keys(groups).map(group_name => 
        group_to_html(group_name, groups[group_name], op.comments, op.pdfBoards, op.op_color)
    ).join("")

    return start() + html + end()
}

export default generate_pdf