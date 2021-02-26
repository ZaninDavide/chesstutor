export const get_board_svg = () => "/files/standard_set/chessboard.svg"
export const get_board_rotated_svg = () => "/files/standard_set/chessboard_rotated.svg"

const whiteKingSVG_standard = "/files/standard_set/white_king.png"
const whiteQueenSVG_standard = "/files/standard_set/white_queen.png"
const whiteRookSVG_standard = "/files/standard_set/white_rook.png"
const whiteKnightSVG_standard = "/files/standard_set/white_knight.png"
const whitePawnSVG_standard = "/files/standard_set/white_pawn.png"
const whiteBishopSVG_standard = "/files/standard_set/white_bishop.png"
const blackKingSVG_standard = "/files/standard_set/black_king.png"
const blackQueenSVG_standard = "/files/standard_set/black_queen.png"
const blackRookSVG_standard = "/files/standard_set/black_rook.png"
const blackKnightSVG_standard = "/files/standard_set/black_knight.png"
const blackPawnSVG_standard = "/files/standard_set/black_pawn.png"
const blackBishopSVG_standard = "/files/standard_set/black_bishop.png"

export const sound_capture = "/files/sound_capture.mp3"
export const sound_move = "/files/sound_move.mp3"
export const sound_error = "/files/sound_error.mp3"

export const printBoardSVG = "/files/chessboard_print.svg"

export const get_piece_src = (name, type = "standard") => {
  switch (type) {
      case "standard":
        switch (name) {
          case "white_king":
            return whiteKingSVG_standard
          case "white_queen":
            return whiteQueenSVG_standard
          case "white_rook":
            return whiteRookSVG_standard
          case "white_bishop":
            return whiteBishopSVG_standard
          case "white_knight":
            return whiteKnightSVG_standard
          case "white_pawn":
            return whitePawnSVG_standard
          case "black_king":
            return blackKingSVG_standard
          case "black_queen":
            return blackQueenSVG_standard
          case "black_rook":
            return blackRookSVG_standard
          case "black_bishop":
            return blackBishopSVG_standard
          case "black_knight":
            return blackKnightSVG_standard
          case "black_pawn":
            return blackPawnSVG_standard
          default:
            return undefined
        }
    default:
      switch (name) {
        case "white_king":
          return whiteKingSVG_standard
        case "white_queen":
          return whiteQueenSVG_standard
        case "white_rook":
          return whiteRookSVG_standard
        case "white_bishop":
          return whiteBishopSVG_standard
        case "white_knight":
          return whiteKnightSVG_standard
        case "white_pawn":
          return whitePawnSVG_standard
        case "black_king":
          return blackKingSVG_standard
        case "black_queen":
          return blackQueenSVG_standard
        case "black_rook":
          return blackRookSVG_standard
        case "black_bishop":
          return blackBishopSVG_standard
        case "black_knight":
          return blackKnightSVG_standard
        case "black_pawn":
          return blackPawnSVG_standard
        default:
          return undefined
      }
  }
}