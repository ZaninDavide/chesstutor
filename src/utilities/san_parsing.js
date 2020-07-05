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
    mark_down_text = mark_down_text.replace(/\$\$Q/g, get_piece_text("black_queen"))
    mark_down_text = mark_down_text.replace(/\$\$K/g, get_piece_text("black_king"))
    mark_down_text = mark_down_text.replace(/\$\$N/g, get_piece_text("black_knight"))
    mark_down_text = mark_down_text.replace(/\$\$B/g, get_piece_text("black_bishop"))
    mark_down_text = mark_down_text.replace(/\$\$R/g, get_piece_text("black_rook"))
    mark_down_text = mark_down_text.replace(/\$\$P/g, get_piece_text("black_pawn"))

    mark_down_text = mark_down_text.replace(/\$Q/g, get_piece_text("white_queen"))
    mark_down_text = mark_down_text.replace(/\$K/g, get_piece_text("white_king"))
    mark_down_text = mark_down_text.replace(/\$N/g, get_piece_text("white_knight"))
    mark_down_text = mark_down_text.replace(/\$B/g, get_piece_text("white_bishop"))
    mark_down_text = mark_down_text.replace(/\$R/g, get_piece_text("white_rook"))
    mark_down_text = mark_down_text.replace(/\$P/g, get_piece_text("white_pawn"))

    return mark_down_text
}

module.exports = {
    make_san_nicer,
    get_piece_text,
    process_comment,
}