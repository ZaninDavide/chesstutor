export const darkBoardSVG = "/files/chessboard_dark.svg"
export const darkBoardRotatedSVG = "/files/chessboard_dark_rotated.svg"
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

export const sound_capture = "/files/sound_capture.mp3"
export const sound_move = "/files/sound_move.mp3"
export const sound_error = "/files/sound_error.mp3"

export const printBoardSVG = "/files/chessboard_print.svg"

export const get_piece_src = (name) => {
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