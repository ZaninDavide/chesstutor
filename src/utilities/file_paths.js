export const get_board_svg = () => "/files/chessboard.svg" // "/files/dark_set/chess_board_dark.svg"
export const get_board_rotated_svg = () => "/files/chessboard_rotated.svg" // "/files/dark_set/chess_board_dark_rotated.svg"

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

const whiteKingSVG_dark = "/files/dark_set/white_king_dark.svg"
const whiteQueenSVG_dark = "/files/dark_set/white_queen_dark.svg"
const whiteRookSVG_dark = "/files/dark_set/white_rook_dark.svg"
const whiteKnightSVG_dark = "/files/dark_set/white_knight_dark.svg"
const whitePawnSVG_dark = "/files/dark_set/white_pawn_dark.svg"
const whiteBishopSVG_dark = "/files/dark_set/white_bishop_dark.svg"
const blackKingSVG_dark = "/files/dark_set/black_king_dark.svg"
const blackQueenSVG_dark = "/files/dark_set/black_queen_dark.svg"
const blackRookSVG_dark = "/files/dark_set/black_rook_dark.svg"
const blackKnightSVG_dark = "/files/dark_set/black_knight_dark.svg"
const blackPawnSVG_dark = "/files/dark_set/black_pawn_dark.svg"
const blackBishopSVG_dark = "/files/dark_set/black_bishop_dark.svg"

export const sound_capture = "/files/sound_capture.mp3"
export const sound_move = "/files/sound_move.mp3"
export const sound_error = "/files/sound_error.mp3"

export const printBoardSVG = "/files/chessboard_print.svg"

export const get_piece_src = (name, type = "normal") => {
  switch (type) {
    case "stilised":
      switch (name) {
        case "white_king":
          return whiteKingSVG_dark
        case "white_queen":
          return whiteQueenSVG_dark
        case "white_rook":
          return whiteRookSVG_dark
        case "white_bishop":
          return whiteBishopSVG_dark
        case "white_knight":
          return whiteKnightSVG_dark
        case "white_pawn":
          return whitePawnSVG_dark
        case "black_king":
          return blackKingSVG_dark
        case "black_queen":
          return blackQueenSVG_dark
        case "black_rook":
          return blackRookSVG_dark
        case "black_bishop":
          return blackBishopSVG_dark
        case "black_knight":
          return blackKnightSVG_dark
        case "black_pawn":
          return blackPawnSVG_dark
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