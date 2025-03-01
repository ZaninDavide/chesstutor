import React, { Component } from "react"
import Chess from "../chessjs_custom/chess.js"
import { pieces_names } from "../utilities/pieces_and_coords"
import { get_piece_src, printBoardSVG } from "../utilities/file_paths"

const chess = new Chess();
let ctx;

class FenViewerCanvas extends Component {
    constructor(props){
        super(props)
        this.state = {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            rotated: false,
        }
        this.draw_board = this.draw_board.bind(this);
        this.draw_board_printable = this.draw_board_printable.bind(this);
        this.drawPiece = this.drawPiece.bind(this);

        this.canvas = React.createRef();
    }

    UNSAFE_componentWillReceiveProps(next_props){
        if(next_props.fen !== this.state.fen || Boolean(next_props.rotated) !== Boolean(this.state.rotated)){
            this.setState({
                fen: next_props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 
                rotated: next_props.rotated ? true : false
            }, () => {
                chess.load(next_props.fen)
                requestAnimationFrame(this.draw_board)
            })
        }
    }

    drawPiece(type, coords){
        const image = new Image();
        const w = this.canvas.current.width

        image.onload = async function () {  
            ctx.drawImage(
                image, 
                Math.floor(coords.x * w / 8), 
                Math.floor(coords.y * w / 8), 
                Math.floor(w / 8), 
                Math.floor(w / 8)
            );
        };

        image.src = get_piece_src(type, "small");
        
    }

    draw_board_printable() {
        const board = chess.board()
        const rotated = this.state.rotated ? true : false

        const w = this.canvas.current.width
       
        /*
        ctx.fillStyle = '#b5a190';
        ctx.fillRect(0, 0, w, w);
        */

        const image = new Image();
        const drawPiece = this.drawPiece
        
        image.onload = function () {  
            ctx.drawImage(image, 0, 0, w, w);

            for (let line = 0; line < 8; line++) {
                for (let collumn = 0; collumn < 8; collumn++) {    
                    // draw piece
                    let piece = board[line][collumn]
                    if (piece !== null) {
                        let type = pieces_names[piece.color === "b" ? piece.type : piece.type.toUpperCase()]
                        if (!rotated) {
                            drawPiece(type, { x: `${collumn}`, y: `${line}` })
                        } else {
                            drawPiece(type, { x: `${7 - collumn}`, y: `${7 - line}` })
                        }
                    }
                }
            }
        };

        image.src = printBoardSVG;

        
    }

    draw_board() {
        const board = chess.board()
        const rotated = this.state.rotated ? true : false

        const w = this.canvas.current.width
        
        ctx.fillStyle = '#b5a190';
        ctx.fillRect(0, 0, w, w);

        for (let line = 0; line < 8; line++) {
            for (let collumn = 0; collumn < 8; collumn++) {
                // draw cell
                const color = (line + collumn) % 2 === 0
                if(color)  ctx.fillStyle = "#efe6d7"; // white f0d9b5
                if(!color) ctx.fillStyle = "#b5a190"; // black b58863

                ctx.fillRect(
                    Math.floor(line * w / 8), 
                    Math.floor(collumn * w / 8), 
                    Math.floor(w / 8), 
                    Math.floor(w / 8)
                );

                // draw piece
                let piece = board[line][collumn]
                if (piece !== null) {
                    let type = pieces_names[piece.color === "b" ? piece.type : piece.type.toUpperCase()]
                    if (!rotated) {
                        this.drawPiece(type, { x: `${collumn}`, y: `${line}` })
                    } else {
                        this.drawPiece(type, { x: `${7 - collumn}`, y: `${7 - line}` })
                    }
                }
            }
        }
    }

    componentDidMount(){
        ctx = this.canvas.current.getContext("2d");
        ctx.imageSmoothingEnabled = false; // no anti-aliasing for performance
        this.setState({
            fen: this.props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 
            rotated: this.props.rotated ? true : false
        }, () => {
            chess.load(this.state.fen)
            requestAnimationFrame(this.draw_board)
        })
    }

    render() {
        return <div className="fenViewerContainer">
            <canvas 
                className="fenViewerCanvas" 
                ref={this.canvas}
                width={this.props.canvasSize || 8*28}
                height={this.props.canvasSize || 8*28}
            ></canvas>
        </div>
    }
}

export default FenViewerCanvas