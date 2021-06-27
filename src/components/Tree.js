import React, { Component } from "react"
import { make_san_nicer, process_comment } from "../utilities/san_parsing"
import FenViewer from "../components/FenViewer";
import Chess from "../chessjs-chesstutor/chess.js"

class Tree extends Component {

    constructor(props) {
        super(props)
        this.tree = this.tree.bind(this)
    }

    tree() {
        // if we are in color mode: TODO combine all commets from all opening of that color
        if (!this.props.op_index) {
            return null;
        }

        let objects = []
        objects.push()

        const first_comment = this.props.getComment(this.props.op_index, [])
        if (first_comment) objects.push(<p className="treeComment" key="treeFirstComment" dangerouslySetInnerHTML={{ __html: process_comment(first_comment) }}></p>)

        let last_long_comment = false
        this.props.json_moves.forEach((c, id) => {
            const moves = this.props.json_moves.slice(0, id + 1)
            const comment = this.props.getComment(this.props.op_index, moves)
            const draw_baord = this.props.getDrawBoardPDF ? this.props.getDrawBoardPDF(this.props.op_index, moves) : false

            let move_text = make_san_nicer(c.san)
            if (id % 2 === 0) { // all white moves
                move_text = ((id / 2) + 1).toString() + ". " + move_text
            } else if (last_long_comment) {
                move_text = "... " + move_text
            }

            if (comment || draw_baord) {
                if (
                    (comment ? comment.length > 35 : false) || 
                    (comment ? comment.indexOf("\n") !== -1 : false) || 
                    draw_baord
                ) {
                    objects.push(<span className="treeMoveSan" key={"treeMoveSan_" + move_text}>{move_text}</span>)
                    
                    if(comment) {
                        objects.push(<p className="treeComment" key={"treeMoveComment_" + move_text} dangerouslySetInnerHTML={{ __html: process_comment(comment) }}></p>)
                    }
                         
                    if(draw_baord){
                        let game = new Chess()
                        moves.forEach(m => game.move(m))
                        objects.push(<FenViewer fen={game.fen()} canvasSize={550} key={"FenViewer_" + JSON.stringify(moves)} />)
                    }

                    last_long_comment = true
                } else {
                    objects.push(<span className="treeMoveSan" key={"treeMoveSan_" + move_text}>{move_text}</span>)
                    objects.push("\u00A0")
                    objects.push(<span className="treeComment" key={"treeMoveComment_" + move_text} dangerouslySetInnerHTML={{ __html: process_comment(comment) }}></span>)
                    objects.push("\u00A0")

                    last_long_comment = false
                }
            } else {
                objects.push(<span className="treeMoveSan" key={"treeMoveSan_" + move_text}>{move_text}{"\u00A0"}</span>)
                last_long_comment = false
            }
        })
        return objects
    }

    render() {
        return <div id="movesTree" key="movesTree">
            {this.props.json_moves ? this.tree() : null}
        </div>
    }
}

export default Tree
