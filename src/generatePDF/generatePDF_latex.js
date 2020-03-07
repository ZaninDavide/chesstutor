import Chess from "../chessjs-chesstutor/chess.js"

let start = (text_size = "large", title_size = "Large") => `
\\documentclass{article}
\\usepackage[utf8]{inputenc}

% two columns
\\usepackage{multicol}
% space between columns
\\setlength\\columnsep{7.5mm}

% page layout
\\usepackage{geometry}
\\geometry{left=20mm, right=20mm, top=25mm, bottom=25mm}

% chess board package
\\usepackage{skak}
\\newgame

% chess pieces
\\usepackage{chessfss}

% underline
\\usepackage{soul}

% document
\\begin{document}

% set size
\\${text_size} % continue with a normal sized font

% two columned part 
\\begin{multicols*}{2}
`

let end = () => `
\\end{multicols*}
\\end{document}
`

let intro = (op_name, intro_text, text_size = "LARGE") => {
    intro_text = intro_text.replace("$$Q", "\\queen ")
    intro_text = intro_text.replace("$$K", "\\king ")
    intro_text = intro_text.replace("$$R", "\\rook ")
    intro_text = intro_text.replace("$$N", "\\knight ")
    intro_text = intro_text.replace("$$B", "\\bishop ")
    intro_text = intro_text.replace("$$P", "\\pawn ")
    intro_text = intro_text.replace("$Q", "\\queen ")
    intro_text = intro_text.replace("$K", "\\king ")
    intro_text = intro_text.replace("$R", "\\rook ")
    intro_text = intro_text.replace("$N", "\\knight ")
    intro_text = intro_text.replace("$B", "\\bishop ")
    intro_text = intro_text.replace("$P", "\\pawn ")
    return `\\subsection*{\\${text_size}{${op_name}}}\n${intro_text}\n` // \subsubsection*{\large{1. e4 - c5 2. \knight f6}}
}

let variTitle = (vari_name, text_size = "Large") => `
\\subsection*{\\${text_size}{${vari_name}}}
`

let nicer_san= (san) => {
    let text = san
    text = text.replace("Q", "\\queen ")
    text = text.replace("K", "\\king ")
    text = text.replace("R", "\\rook ")
    text = text.replace("N", "\\knight ")
    text = text.replace("B", "\\bishop ")
    text = text.replace("P", "\\pawn ")
    return text
}

let line_moves = (moves_array, last_index, text_size = "large") => {
    let index = last_index - (moves_array.length - 1)
    let text = ""

    moves_array.forEach((move, offset) => {
        let final_index = index + offset
        if(final_index % 2 === 0){
            text += (Math.floor(final_index / 2) + 1).toString() + ". "
        }
        text += nicer_san(move.san) + " "
    })

    return `\\subsubsection*{\\${text_size}{${text}}}` // \subsubsection*{\large{1. e4 - c5 2. \knight f6}}
}

let fenBoard = fen => `
\\begin{center}
\\fenboard{${fen}}
\\showboard
\\end{center}
`

let boardFromMoveName = move_name => {
    // generate fen
    let game = new Chess()
    move_name.split("|").forEach(san => {
        if(san){
            game.move(san)
        }
    })
    return fenBoard(game.fen())
}

let processComment = (comment_text) => {
    let text = comment_text

    const regex_bold = /\*(.*?)\*/gm;
    const subst_bold = `\\bfseries $1\\mdseries `;
    let mark_down_text = text ? text.replace(regex_bold, subst_bold) : "";

    const regex_line = /_(.*?)_/gm;
    const subst_line = `\\ul{$1}`;
    mark_down_text = mark_down_text ? mark_down_text.replace(regex_line, subst_line) : "";

    /* MAKE MOVES LOOK NICER */
    mark_down_text = mark_down_text.replace("$$Q", "\\queen ")
    mark_down_text = mark_down_text.replace("$$K", "\\king ")
    mark_down_text = mark_down_text.replace("$$R", "\\rook ")
    mark_down_text = mark_down_text.replace("$$N", "\\knight ")
    mark_down_text = mark_down_text.replace("$$B", "\\bishop ")
    mark_down_text = mark_down_text.replace("$$P", "\\pawn ")
    
    mark_down_text = mark_down_text.replace("$Q", "\\queen ")
    mark_down_text = mark_down_text.replace("$K", "\\king ")
    mark_down_text = mark_down_text.replace("$R", "\\rook ")
    mark_down_text = mark_down_text.replace("$N", "\\knight ")
    mark_down_text = mark_down_text.replace("$B", "\\bishop ")
    mark_down_text = mark_down_text.replace("$P", "\\pawn ")

    return mark_down_text
  }

let comment = text => {
    return `\n${processComment(text)}\n` // \subsubsection*{\large{1. e4 - c5 2. \knight f6}}
}

let moveName = json_moves => {
    let str = "|"
    json_moves.forEach(elem => {
      str += elem.san + "|"
    });
    return str
}

let generatePDF = function (op, settings){
    let latex = ""
    let movesAdded = [] // here i store all the moves names that where already discussed

    // the opening written as key blocks
    let blocks = []

    // add intro if written
    latex += intro(op.op_name, op.comments["|"] || "")

    op.variations.forEach((vari, id) => {
        // add the title if the variation
        blocks.push([
            "variTitle", vari.vari_name
        ])

        let one_line_moves = []
        
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
                        "line_moves", one_line_moves, index
                    ])
                    // restart stacking moves on one line
                    one_line_moves = []
                    // draw this board position here
                    blocks.push([
                        "board", move_name
                    ])
                }
                if(op.comments[move_name]){
                    // stop stacking moves on one line
                    if(one_line_moves.length > 0){
                        blocks.push([
                            "line_moves", one_line_moves, index
                        ])
                        // restart stacking moves on one line
                        one_line_moves = []
                    }
                    // write this comment here
                    blocks.push([
                        "comment", move_name
                    ])
                }
            }
        })
            
        if(one_line_moves.length > 0){
            blocks.push([
                "line_moves", one_line_moves, vari.moves.length - 1
            ])
            // restart stacking moves on one line
            one_line_moves = []
        }
    })

    // turn blocks into latex
    blocks.forEach(b => {
        if(b[0] === "variTitle"){
            latex += variTitle(b[1]) 
        }
        if(b[0] === "line_moves"){
            latex += line_moves(b[1], b[2]) 
        }
        if(b[0] === "board"){
            latex += boardFromMoveName(b[1]) 
        }
        if(b[0] === "comment"){
            latex += comment(op.comments[b[1]]) 
        }
    })

    let final_latex = start(settings ? settings.text_size : undefined,  settings ? settings.title_size : undefined) + latex + end()
    return final_latex
}

export default generatePDF