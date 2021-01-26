export const get_board_svg = () => "/files/standard_set/chessboard.svg"
export const get_board_rotated_svg = () => "/files/standard_set/chessboard_rotated.svg"

const whiteKingSVG = "/files/default_set/white_king.svg"
const whiteQueenSVG = "/files/default_set/white_queen.svg"
const whiteRookSVG = "/files/default_set/white_rook.svg"
const whiteKnightSVG = "/files/default_set/white_knight.svg"
const whitePawnSVG = "/files/default_set/white_pawn.svg"
const whiteBishopSVG = "/files/default_set/white_bishop.svg"
const blackKingSVG = "/files/default_set/black_king.svg"
const blackQueenSVG = "/files/default_set/black_queen.svg"
const blackRookSVG = "/files/default_set/black_rook.svg"
const blackKnightSVG = "/files/default_set/black_knight.svg"
const blackPawnSVG = "/files/default_set/black_pawn.svg"
const blackBishopSVG = "/files/default_set/black_bishop.svg"

const whiteKingSVG_standard = "/files/standard_set/white_king.svg"
const whiteQueenSVG_standard = "/files/standard_set/white_queen.svg"
const whiteRookSVG_standard = "/files/standard_set/white_rook.svg"
const whiteKnightSVG_standard = "/files/standard_set/white_knight.svg"
const whitePawnSVG_standard = "/files/standard_set/white_pawn.svg"
const whiteBishopSVG_standard = "/files/standard_set/white_bishop.svg"
const blackKingSVG_standard = "/files/standard_set/black_king.svg"
const blackQueenSVG_standard = "/files/standard_set/black_queen.svg"
const blackRookSVG_standard = "/files/standard_set/black_rook.svg"
const blackKnightSVG_standard = "/files/standard_set/black_knight.svg"
const blackPawnSVG_standard = "/files/standard_set/black_pawn.svg"
const blackBishopSVG_standard = "/files/standard_set/black_bishop.svg"

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
}