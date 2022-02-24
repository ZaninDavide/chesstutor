function get_piece_text(name) {
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

function make_san_nicer(san, color = "white"){
    let new_san = san
    new_san = new_san.replace("Q", get_piece_text(color + "_queen"))
    new_san = new_san.replace("K", get_piece_text(color + "_king"))
    new_san = new_san.replace("N", get_piece_text(color + "_knight"))
    new_san = new_san.replace("B", get_piece_text(color + "_bishop"))
    new_san = new_san.replace("R", get_piece_text(color + "_rook"))
    new_san = new_san.replace("P", get_piece_text(color + "_pawn"))
    return new_san
}

function make_san_nicer_html(san, color = "white"){
    let new_san = san
    new_san = new_san.replace("Q", "<span class=\"chessText\">Q</span>")
    new_san = new_san.replace("K", "<span class=\"chessText\">K</span>")
    new_san = new_san.replace("N", "<span class=\"chessText\">N</span>")
    new_san = new_san.replace("B", "<span class=\"chessText\">B</span>")
    new_san = new_san.replace("R", "<span class=\"chessText\">R</span>")
    new_san = new_san.replace("P", "<span class=\"chessText\">P</span>")
    return new_san
}


function escape_html(text) {
    if(!text) return ""
    return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

function process_comment(comment_text){
    let text = escape_html(comment_text)

    const regex_bold = /\*(.*?)\*/gm;
    const subst_bold = `<b>$1</b>`;
    let mark_down_text = text ? text.replace(regex_bold, subst_bold) : "";

    const regex_line = /_(.*?)_/gm;
    const subst_line = `<u>$1</u>`;
    mark_down_text = mark_down_text ? mark_down_text.replace(regex_line, subst_line) : "";

    /* MAKE MOVES LOOK NICER */
    mark_down_text = mark_down_text.replace(/\$Q/g, "<span class=\"chessText\">Q</span>")
    mark_down_text = mark_down_text.replace(/\$K/g, "<span class=\"chessText\">K</span>")
    mark_down_text = mark_down_text.replace(/\$N/g, "<span class=\"chessText\">N</span>")
    mark_down_text = mark_down_text.replace(/\$B/g, "<span class=\"chessText\">B</span>")
    mark_down_text = mark_down_text.replace(/\$R/g, "<span class=\"chessText\">R</span>")
    mark_down_text = mark_down_text.replace(/\$P/g, "<span class=\"chessText\">P</span>")

    return mark_down_text
}

function parse_moves_list(moves){
    let moves_parsed = ""
    moves.forEach((move, i) => {
        if(i % 2 === 0){
            // white's move
            moves_parsed += (Math.floor(i / 2) + 1).toString() + ". "
        }
        moves_parsed += move.san + " "
    });
    moves_parsed.trimEnd() // remove last empy space
    return moves_parsed
}

function move_to_fromto(move) {
    return move.from + move.to + (move.promotion ? move.promotion.toLowerCase() : "");
}

module.exports = {
    make_san_nicer,
    make_san_nicer_html,
    get_piece_text,
    process_comment,
    parse_moves_list,
    move_to_fromto,
}