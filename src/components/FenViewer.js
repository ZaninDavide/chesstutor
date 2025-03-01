import React, { Component } from "react"
import Chess from "../chessjs_custom/chess.js"
import { pieces_names } from "../utilities/pieces_and_coords"
import { get_piece_src, fenViewerBoard } from "../utilities/file_paths"

const chess = new Chess();

class FenViewer extends Component {
    constructor(props){
        super(props)
        this.state = {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            rotated: this.props.rotated,
            board: chess.board(),
        }
    }

    UNSAFE_componentWillReceiveProps(next_props){
        if(next_props.fen !== this.state.fen || Boolean(next_props.rotated) !== Boolean(this.state.rotated)){
            chess.load(next_props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
            this.setState({
                fen: next_props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 
                rotated: next_props.rotated ? true : false,
                board: chess.board(),
            })
        }
    }

    componentDidMount(){
        chess.load(this.props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
        this.setState({
            fen: this.props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 
            rotated: this.props.rotated ? true : false,
            board: chess.board(),
        })
    }

    renderBoard(board, rotated = false) {
        let pieces = []

        for (let line = 0; line < 8; line++) {
            for (let collumn = 0; collumn < 8; collumn++) {    
                // draw piece
                let piece = board[line][collumn]
                if (piece !== null) {
                    let type = pieces_names[piece.color === "b" ? piece.type : piece.type.toUpperCase()]
                    if (!rotated) {
                        let x = collumn * 100
                        let y = line * 100
                        pieces.push(
                            <img alt="piece" key={`${type}_${collumn}_${line}`} src={get_piece_src(type, "standard")} style={{transform: `translate(${x}%, ${y}%)`}} className="fenViewerPiece"/>
                        )
                    } else {
                        let x = 700 - collumn * 100
                        let y = 700 - line * 100
                        pieces.push(
                            <img alt="piece" key={`${type}_${collumn}_${line}`} src={get_piece_src(type, "standard")} style={{transform: `translate(${x}%, ${y}%)`}} className="fenViewerPiece"/>
                        )
                    }
                }
            }
        }

        return pieces
    }

    render() {
        return <div className="fenViewerContainer"><div className="fenViewerGrid">
            <img alt="board" className="fenViewerBackground" key="fenViewerBackground" src={fenViewerBoard} />
            {this.renderBoard(this.state.board, this.state.rotated)}
        </div></div>
    }
}

export default FenViewer