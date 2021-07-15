export const get_board_svg = () => "/files/standard_set/chessboard.svg"
export const get_board_rotated_svg = () => "/files/standard_set/chessboard_rotated.svg"

const whiteKing_standard = "/files/standard_set/white_king.webp"
const whiteQueen_standard = "/files/standard_set/white_queen.webp"
const whiteRook_standard = "/files/standard_set/white_rook.webp"
const whiteKnight_standard = "/files/standard_set/white_knight.webp"
const whitePawn_standard = "/files/standard_set/white_pawn.webp"
const whiteBishop_standard = "/files/standard_set/white_bishop.webp"
const blackKing_standard = "/files/standard_set/black_king.webp"
const blackQueen_standard = "/files/standard_set/black_queen.webp"
const blackRook_standard = "/files/standard_set/black_rook.webp"
const blackKnight_standard = "/files/standard_set/black_knight.webp"
const blackPawn_standard = "/files/standard_set/black_pawn.webp"
const blackBishop_standard = "/files/standard_set/black_bishop.webp"

const whiteKing_small = "/files/small_set/white_king.png"
const whiteQueen_small = "/files/small_set/white_queen.png"
const whiteRook_small = "/files/small_set/white_rook.png"
const whiteKnight_small = "/files/small_set/white_knight.png"
const whitePawn_small = "/files/small_set/white_pawn.png"
const whiteBishop_small = "/files/small_set/white_bishop.png"
const blackKing_small = "/files/small_set/black_king.png"
const blackQueen_small = "/files/small_set/black_queen.png"
const blackRook_small = "/files/small_set/black_rook.png"
const blackKnight_small = "/files/small_set/black_knight.png"
const blackPawn_small = "/files/small_set/black_pawn.png"
const blackBishop_small = "/files/small_set/black_bishop.png"

const whiteKing_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAMTSURBVEhL7ZbfS5NRGMfPfro10JyDJMqgoRmKiWBF3k4FoVuhCDbQvMs/YH/B8LIuIkicV+5GWHfNqwi3bEwGhjJbV+VMx5Yb5mQ/T9/nnCOkTR2tdeUHvrznec6P5z3Pec85L7vgFC4p/ReeWCyWLJRB+bF0NQ5TU1NTdmtri5OMRuN3+PSyqja06lkrHJRyuRw7ODggo6z8DYNm80qn03ESyi8hHVU0ghsajeb96OgoDwaDfHl5mQ8PD1PQd9B10eIf0oW12/Z6vbxSqVBaBVSenZ2ltfyGNnbZtH7Mer1+w+/3qzCcLywscJ/PpyzOFxcXKcWf0NYou9TH9MTEhBiYZkSpnJycFAqFQsJPOJ1OSu8z2aUOsG4f19bWxKD5fJ67XC7e19cnNDU1xYvFoqiLRCIUMCh71YHJZMIuyIlBj5iZmRH6nf39fY6XS6puf4/BYEgkk0k1rCSTyfBsNqssSSKRoIBfVLdTOXfjI2X+ubk5ZUlaWlpYc3OzsiTz8/N0ELxV5qlo1PMsrmCWIbfbfXNwcJDWVLklCMJWVlaYx+OJl0qlB3ClZE11aglIPLRarW9GRkYQ78+AgUCgsre3NwYzIL31occM4+FwmJaqKnTyYB9uoO25E6hlhrcRcKOzs1OZ1dnc3GTlcrkLxbj0VKeWgPcHBgY+4GRhZrNZuY5DN8f4+DjDfr0HMyy91akloAF6brPZXFhDU09PD2traxMVqVSKra+vs6WlpcN0Ok2f8jR05pVVLSD5aERKjxWi85F0FXoE3WlvbzfgmGPYn0XYUcgHbUNkF6AfUEw9j3EyIAXwdnR0jPX29upoJrgJhPBLwRCI9ff3MxxrojFSyKLRKNvd3RVpLRQKQjTz1dXVPF6I7ks3dCg6gJMBvUNDQ06HwyFShROF0UwoIL5Chn3GdnZ2KrFY7Cfaarq7uy14CS1uE/pgRDCtVstaW1uZ3W5nuEVYPB5/jbZPxejgZMBbEJ34XyFa/DRUgSildNuXIPp5ovQRlObL0FEdpZNOLxt0F7oGvYA+Qxc0AsZ+AYtGs/xx+DqDAAAAAElFTkSuQmCC"
const whiteQueen_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAARXSURBVEhL7VZbSKxVFF6OOjPeTaTDMVNrFC0wzAteENNQCLFThj6KmhqaLx4ffAgRX071FkJEEAj14EsnQh8TlDhkRAnpwcGx5NgFb3gbx3F0dNx93/7nl5lz5ignzlt98M1ea+39r7X+vdbe/8j/eAzignzqeAbsBEu1ZuC1uLi4XRJyjWHSsILPGuK/gyUqKurHnp4elZWV5Yf+qmGWu1NTU2pyclJB/towyc3Y2NgHmZmZF5A/NkzXIxosAc0s7UlJSe7d3V3V0dFB5x2GWW6XlZUpEvKAYZKu/v5+5Xa7VXx8/B50i2GWG2AxaOph+KqiokIlJycfQM41THLbYrGcYvwJTNQWkSjwG/Cu1gy8nJaW5qmrq2MSnCMKUlJSPOXl5bR9aZhCkJiY6D06OlKDg4Nc0GdYNe6BnxviJX4BfzbES3wI0harNfigr729PYXtdgdtYRjLzc0NWK1WvlG2YdJgQDaI2ZU2bLXPZrP5IJvObeDf4PdaM5CHNQH4PIf8iWEKB7fqBZAN0ktDEPcqKytDa1hcU1OjuP2UDZO8mZOTQz00YD/oBXO0FkRoMfnAA9CF7mSn3aSRQKcKbD1BtQQQJKFlbUGCfX2hVZDnsf4jjL+Da9oSRKTuud/U1JSC8TOQb62d5+XlVUB8CSwpLS1lVE7x50Xgjfr6euoEn/m0sbExCeOStoQgUkBnVVWVYMvegkxKdHS09Pb2cu17yLyKwYqL9W4yYFdnZ6clJiaGOvEOnr9VXV1N2akt16C5vb1dLS4uKhT9L+i/rqysqO3tbWW32/dwbM7Oz88Vyc7Gmv2NjQ21sLDAkixizcbS0pJqa2uj/jYdXod8HmpieHiYDykGJFpbWxUbxgTllpYWLQcDqpGREa0XFhZSD+12DV2jh5CAA7s9NDQU73Q6ZWJiQvLz8wVnVI6PjwW+BJeBXnhxcaGJcyZ4U1lfX5fm5mYpKCiQsbExt9frTccyHotLRApI22/d3d2O2tpacTgckp2dLQkJCdox6xkaMBAIyNnZmcC5rK2tyerqqszOzsr4+Ph9LHlFLwxBpIDEu2iKL6anpy0MgDtSDg4OtFO/36+DEJzDRcFbSlJTUwX11fMNDQ0BbHEXljxypT0uIHEHDj7AHSnYYk06ZgCzI9E4cnp6qhNhQoeHh4LLXjwezx1MD+tFD+GqgHZs3drOzs4NM3MGMEmYW8wEmMjW1pbgE/Un6uzAdFjtTFwVkDeNq6ioKAlH4tIxR5Lg1pJMgGN6errgOO1jil8bfqaeCN+Ojo4ql8ulTk5OFBwqNImmCVPnHNcsLy+rgYEBHoeIl/VVyM7IyPDTyZNibm6OAefBiLtn7M2jeA7N8j7qYtnc3JT9/X3x+Xy6QcwasqY8l5zDTSO4HGR+fl5wy8jMzIwVb8635F+OMFxVw1rwdTAL5N+ONJBffTtoJsrzcQIegazZNvgH+B34A/jUwESvSvY/C5F/AAMeFKEhnzipAAAAAElFTkSuQmCC"
const whiteRook_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAIaSURBVEhL7ZZBaxpBFMdHiRoa44KK9lIraCKYL9Cr9BsoPaWHHgVP3j0VPHrzZA85tGkOIkounnIIAaFHsUQlWUvFFC0ritKtqMv2PWckTbI7MZKEBPzBn3nvPzv7xnF3ZsmKZ4+BtXr836+y9voYLX/u3YmPoF9MWTSAF6Az0Nz/DjKDkEPQ3Mexd2Yvn8+rtVoNZythDtp3u93KaDRSUS6XawLeZ9bXE0VRzWazeD3mmqyxVhOTyUT8fj8pFouOyWTyAT2n00ksFsusv1AorEmS9B5js9lMvF4vqVQqsz49eP/hl2AwuGu321m6GN1ul1Sr1X0IZxO5Dq/glsFgOEomk6/C4TCz+ORyOZJIJH6qqvoWUpG6V+EVRHywVN+i0ajDZrMxS5ter0cymcxvWPo3kP6g7nKc1Ot1mDSfcrmMD8sxHaKPkbWPxqrgvfM0C7bbbdJqtbjqdDrsaj63vYeb8B6ep9Npl9VqZZY2g8GAxGKxC0VRtiGVqXsTXkHcZ796PJ53kUiEOreAO02z2TyAcBekeUTxCm4IgiClUql12OKYxWc6nZJ4PP5HlmUBUoW6V9G70wZIgONHhI143Whc7Nkaj8ckEAjI/X7fA+lf0I2l1SqIXsPn83kxgV0Lm4XB1cAxjUbjFNId6l6iVRB/zkWpVHqJZ9wyDIdDEgqFziHcos4lekv6CfSahkuDnyIxGq54MAj5Bwkq3lwHXfUkAAAAAElFTkSuQmCC"
const whiteKnight_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAALiSURBVEhL7ZXfS5NRGMff/WjDdIwmjozmLtoUU1NkjNlI7wYGCaKBdGf+ARKEYAnT65g3eSUl3gTCwh83QtGNF0IzsougK5EhZUsWLtsu0r3v0/d5zxFN3Xq1XXThB77snLPzfM95z3ve51HO+R+4AF0UzdLjgD5BjyET5DKbzQmTyfQBbTNUci5XV1erwWBQQ/sB9HJsbIzq6uryaLdANqikmK1Wa2ppaYm6u7upv7+f9vb2KBqNaq2trVRRUZHFnFnoDmTlgH8l6PP5VF7kJHK5HC0uLlIkEiEc8zvMvy7CzobTZrMlJycnaWRkhDRNk8uczPz8PDmdzh+IC4vw0/NkaGiI2traqKamhvL5vLQuzMrKCh9zGrFeYWEcHy7LbiaToUAgQPF4XFoesLm5Sdvb27J3wNTUFCH+FcS32hA8cZaPshiDg4M0PT0teweoqsqbVOFxS3czQKixsRFxqrQ4ztbWFrndbtrY2JAjf8InAp+4sPsLuG2vFxYWZOhxstksdXR0aC6XS44ch+c4HI4M7OzCtTCB5uZmrdDTpdNpCofDvPvnXq+36C3q6urieRHd9RBH09P93t5eU0NDg5JIJOSQYHV1VQmFQrvLy8sP0X3m9/st4p+TaW9v55+beucQRxf04wkUfMhKVVWVgo3qGh8fV/B5fF1bW7uNOTHobmdnpx5QiJYWznzKDb1ThKcTExP6kTQ1NdHo6CgNDw/z0byBKvUZinINm8nxJ1OM9fV1zj4fZUxBau12e4rzpMViob6+Pg7iyrBfjirZZGZmRtoWZmdnh5CHv8u4onAFqIWiECdmD8RUojS9j8Vi0rI4nArLy8t/Ia5MhJ+OMjzZW7xLaWcMzlaI3X8Vp+LRwMCAtDEObjLXzSvCwjhWVI3PqVRK2hinvr6eF7wqbARGEqzb4/F8m5ub4ywkh4zR09OjJpNJrhxfxIixBS9BL6CzVHS+NPegn3rvnNKjKL8BcEsa1M5IAKYAAAAASUVORK5CYII="
const whitePawn_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAH2SURBVEhL7ZXNSwJBFMDH3bJV6yJhIt1SEQqCFETIwE6e+wP6HwRvnvTQKegkWOyf4MFTXjwsaHQI7OhBkA5i+IEejPWQ6/TGmTDLj1lZT/mDx7yZee/NvPlEGzasm32Qe5A3EAUkDLI2REEQnlKpFO50OrhQKGCn06lC+zHtNp7TUCiER6MR/iaTyWBov6PdfAis5EGyWq3IZDKxKkI2m40U0riyBs4kSdJqtRrLD+NIJKI7Q14OLBZLK5/Ps6EozWYTBwKBEfRfUzPjuEkmk2yYaarVKhZFkZzaLWpqDC8k8Dz8fj/J8pCaLob30GwDTP0L6xPHlSXwDljM5XJMnQb2EZXL5Rao77TFGI7sdvsHBGaLSOn3+zgajZKTGqdmy+HJkFy8S03TxGw2i+Di01agVCqher1O1CDIHlGMIB4MBnGj0WB5TTMcDnEikcDwIDyDrZW6rM6Fx+PRer0eCz8b8tzFYjGytA/UbTVEmPWroigs7GIGgwF2u92f4HdC3fVzHg6HWTg+ZFkmWcrUXT+36XSaheKj3W5js9ncAF89nwIFlrNYqVRYKD7IXvp8PpLl3Fdn7kxgpm6Hw4HgOnALuTJer5e4e8ZBZjD53H4BGXZcLtfuz/+Ph263i1RVvQL1kbZMsyjaDitXgZzWyQvxj0DoCxSd7GLNO8VWAAAAAElFTkSuQmCC"
const whiteBishop_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAMTSURBVEhL7ZbfS5NRGMfPfro10JyDJMqgoRmKiWBF3k4FoVuhCDbQvMs/YH/B8LIuIkicV+5GWHfNqwi3bEwGhjJbV+VMx5Yb5mQ/T9/nnCOkTR2tdeUHvrznec6P5z3Pec85L7vgFC4p/ReeWCyWLJRB+bF0NQ5TU1NTdmtri5OMRuN3+PSyqja06lkrHJRyuRw7ODggo6z8DYNm80qn03ESyi8hHVU0ghsajeb96OgoDwaDfHl5mQ8PD1PQd9B10eIf0oW12/Z6vbxSqVBaBVSenZ2ltfyGNnbZtH7Mer1+w+/3qzCcLywscJ/PpyzOFxcXKcWf0NYou9TH9MTEhBiYZkSpnJycFAqFQsJPOJ1OSu8z2aUOsG4f19bWxKD5fJ67XC7e19cnNDU1xYvFoqiLRCIUMCh71YHJZMIuyIlBj5iZmRH6nf39fY6XS6puf4/BYEgkk0k1rCSTyfBsNqssSSKRoIBfVLdTOXfjI2X+ubk5ZUlaWlpYc3OzsiTz8/N0ELxV5qlo1PMsrmCWIbfbfXNwcJDWVLklCMJWVlaYx+OJl0qlB3ClZE11aglIPLRarW9GRkYQ78+AgUCgsre3NwYzIL31occM4+FwmJaqKnTyYB9uoO25E6hlhrcRcKOzs1OZ1dnc3GTlcrkLxbj0VKeWgPcHBgY+4GRhZrNZuY5DN8f4+DjDfr0HMyy91akloAF6brPZXFhDU09PD2traxMVqVSKra+vs6WlpcN0Ok2f8jR05pVVLSD5aERKjxWi85F0FXoE3WlvbzfgmGPYn0XYUcgHbUNkF6AfUEw9j3EyIAXwdnR0jPX29upoJrgJhPBLwRCI9ff3MxxrojFSyKLRKNvd3RVpLRQKQjTz1dXVPF6I7ks3dCg6gJMBvUNDQ06HwyFShROF0UwoIL5Chn3GdnZ2KrFY7Cfaarq7uy14CS1uE/pgRDCtVstaW1uZ3W5nuEVYPB5/jbZPxejgZMBbEJ34XyFa/DRUgSildNuXIPp5ovQRlObL0FEdpZNOLxt0F7oGvYA+Qxc0AsZ+AYtGs/xx+DqDAAAAAElFTkSuQmCC"
const blackKing_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAPMSURBVEhL7ZZJSKRXEMfLuOOKC3hQE+OGO0HRAdGAQS+aTKsYEgYmikQlGCFuF0EPHjwEFaOCrRcviZiL085BERdEiTAOqBEFHZB2ARUTjQmJ2mpX/vXydU86021skrnNH358/Zav3qt6Ve9reqP/W67a01kVgVjwQrWckLMLuoGvwCPwAASBZcDgXnpLe95XYvh3YNKQ307JWQ9lwecgEuyBb7S+16oy8JNGqXS8TsUBCaV4JfwB3gH3lqOQvg0+AyUgBVyAY/A5KAAWuYMj8CP4EHwKPgCSTEZwDe6Wv7//o8bGxsvl5WXe39/nhYUFbmlpMUdFRc1ieBhYvLPwQ0pKys/d3d28tram3pmamuLy8nKjm5tbJsYdy93dPWlkZMQEOCkpiYODgzktLY3b29t5d3eXm5ub2dXV1bqYl5cX9/T08NbWFtfW1nJ0dDSHhIRwTk4Oz8/P88DAwJmnp+e7yrg9lZaW6ldWVmyMWggKCmKDwcCjo6OMnTMM8eTkJA8ODqrf/5wvmxGPS0pKBtC2yqYOY2Nj30c46Pb2Vut5qdPTU9mQGuvo6KCuri4yGo1UXV1NV1dX2qyXury8pOnpaUpISEjVupRsFsSkX0JDQ7XWq7q5uaHKykoqLi6m/Px8qqurI2ZxyL7i4+Pp8PBQksq+MOFLOauYmJhXQvR3WltbFfbGLOTl5fHm5qY5MDDwI7QdyqOqqurZ9vY2JyYm2hhwcXFheK/6EU7u7OzkyMhIRqLZzBNyc3N5b2+Pi4qKvkPbBVhl09AUWlFRMd7W1vZgaGiIzs7OqLCwkFJTU+n6+pqOjo7o4uKCkDiELCY5AjnL2dlZGhsbI51OR2VlZdzQ0PD9+Pj4Y9iTi+Jf5VFTU6NHonBvby9nZ2ezj4+P2r145Ovrq7LQ0pZyqK+v5/X1dV5dXf01PDz8C4zZ/TDY81DJw8PjIYw+Ec/Ew6ysLIJh8vPzU56idFTGHhwcEBahmZkZmpiYILPZbDg/P9dpZu6vpqYm3cbGBs/NzTGykZOTkzkgIMBao3Km3t7eHBERwRLC4eFhdcv09fU9/cuCfTn0MC4u7iHO6cnJyYkqgczMTOmjsLAwwkKqRKQ2d3Z2lIfYmPIWmW5YWlpy6KHDBZFhOtyHY+np6Spci4uLhDOi4+NjMplMKqTwWG1Cwl1QUEC4cai/v/+pXq+/sxTsCruOwiU+B8Ny7VhT3hES4oyMjAO89wna/0nvga/BMyAf3Rsgi5jBb2AbfAs+Bl7gTjkMqQPJnyj5Boph+dZJjclTNvBGENGfiFvHGeykMGoAAAAASUVORK5CYII="
const blackQueen_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAOySURBVEhL7ZbLS1RRHMd/PqZx1N7ojGiYrxCpEctKDBUNWmTmsk0RGGktlPoTzBZtQhTaVJuKNkUQGEiChqMhFfmYDCYmiRTUAZsMx7c2fb9n7tWrXjVp0aI+8GHO+c2559zzO48Z+c/fIB5aQkWFAz6ED6CdAY1tkG3/iNvwJ/wM4xgA92FQk2WSAL9Atr3FwHqEa58kAh6B+lva4GUYBtPgWUjmtU+il0/D/ZBtK6HeLzNwGBrHWYJp4luPw3TIh5u02A+YAcke+Ba+gbsZAFkwANn2GQMgE05Axpj+NegP0KsMAK7LU/hc1ZZ5BVtDxSVewCdQX2/2offHF15DA1yEk3AfAxp3IWP6bJh6ZuE7ZBYI13AWsq1OKpyD7LOeAWLM7TV4BkbBXAY0OMtoeFHVQqndCXfBAwyAc5DtqA73QyQ8Ba8zYEYMXIDDkB2Sx5Bp6YOc0QWtTllm7INWZ1uyF/rgFOTmW2L17mHqPkKmiCkm+lsfgjnQOHuW6UFVW27LFHK3e+A0Azpm2/Wd9nkeMh36JuBMLsETqhbiKKwIFRVsyyPCZ8l77XNDjLuLh9llqHOjcCPodWbEuLtfw0FD/QrclGNQf4Dy9jDWtyKXYFN2QObdrIOtyJkb72CFfo6MMOaFvM4kMjJSMjMzxel0SmpqqtjtdomNjeVXEggExOfzycDAgLjdbvF4PLK4yGOn4M51horLmA1IKvLz8+/V1NSEFxQUyNDQkPT29orX65XR0VGZnOTSiRrY4XBIenq65OTkSGJionR0dEhjY+NiV1cXN5jplWZKbW3tzbKysmBMTIxZukzFCwTLy8uDdXV1N1A3Zb0ZEmtDQ8PX0tJS42/epjQ3Nw9WV1dzOXiBrGGjAROio6M/Wa3W7Vr9t5idnfVPTU3x+vOHIivhRWwKZvaopaUlOyMjQ2w2m8zMzIjf75fp6Wl2KnNzc7KwsKA2VUpKihQXF0tVVZXU19fbRkZGrP39/S+1rlaw3gyT4+LivMFg0FJUVCQ0OztbkpKS1ABGOCg3VV9fn3R2dkpbW5sgK93Dw8O88ri2K1hvwKz29nZ3fHx8RFNTk7hcLunp6ZGxsTHBSyhJWFiYEi+ndmlhYaFgo8n4+Pi3vLw83sfGfweKjdbwZG5ubmVJSUkhOnPwHPIYcEbz86F+LBaLmvHExIQ6h3ipkdbWVld3d/cdfN2hGq1iowF1uM7J8HhUVFQaBrHjqPBnjOcxgMF9WN8BVPmXg/fo0sn/FxH5BeyOT3bgkeD/AAAAAElFTkSuQmCC"
const blackRook_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAGeSURBVEhL7ZbPSgJRFIdvf8xoJloIuggmF9kmMAjdDYyvEO7E6QV6i16jIkxbtcneoHGruBmCsIIWlUIQSBoyxHROcwTNe+84UkLgBx9zzm+8nPEOMwyb8e+Zo6OIwfMuHX+u4eX9LBCH4DN5gQGwAjbAfm6DSyByBfZzXBuYUxCvFH2l/hz8pAx1wCKI594oQ7EPzODAoAoHCu9hPp8/S6VSJrWBqFarxVKptE/tEMKBsVgs3ul0LsPh8I6iKJTKgd+zXq9XV1V1r9lsPlI8hHAgoeZyuXo6nd6kXkqtVruFf7YLZddLJqMC8u4Tz2tQyjwdp8Zs4K8z9YF+jwULhUIVUKdWiuM4FmhQy8Vv4KppmneZTCZKvRTLsp4KhcIWlMLnULali4lE4sQwjKjrumwcdV1f1zTtGNb67hwPfJ99gLwHXOY7uAByEV0JDltLJpP38F5c9qLxaLfbXdu2NSjxYke2ljcQswcwns1mWSQS+Q7HpdVqsXK5jOUNuI2FH3hfX0DedgURvwxGEG3pEbjhlRODAw+8csafwdgX9x+7ARY4zMoAAAAASUVORK5CYII="
const blackKnight_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAJ2SURBVEhL7ZZBqBJRFIavmmaS+DIEQShQK4h4uIiUIkLITVAg6CZEJFy1C1opQiCuIly0DVq1Kl7r1I0gUrhoISSki0SwFiVGmvooT/+Z0dJ5o817uWjxPvjgnjM6v3fmzlzFIf8DRmiRh5vHCt/BNNRBO3wD30I93DhO+BNO4T34AhL8AX3QBDcKz+IT5JBF+QdQMpkcxGKxna2trZuoj8B/5hLkGSoDJXO5HHU6HWo2m4TgGnrn4YGxwQ9er5ey2SzpdDrVUJPJROl0miaTCaVSqa/oXYEH4iGkarVK7XabDAaDauDccDgshSYSic+oT8N94YW7HFKr1SgSiaiGKM1kMtTr9cjlcr1CzataE/zBHah60nWazWZqtVqUz+f5vl+FmgjAlQvlb2LlSrO0Wq3PUWuiAFVPtqD0WKiJR4RGoxFFo9E+6qNwCeXb4iK8Lg/X8hTyVdhDv98X5XJZhEIhXuXX5O4flIF3HA6HrtFoCL/fP2stsQvvwyfQwA01KpWKCAT4zojLUmMBZeCZ4XAoCoWC6Ha7s9ZvPsIb8BGMcmMV9XpduN1uYTQat2etlTyGavemBE9CxgOHUO1zkj6fjxiPx1NHvZazUPnu5J1hvh1xKJ9k8fgenU6nFBgMBr+gXkJ5Sd/DU/AcfABfwlvwO+QwXsEX4FoGg4GYTqfCbrcfR3lM7u4P/tJrqDojpRaLhcbjMcXjcV5k81shoZzhKngvVF22q8AV5UXD5196FrUE8j53Vx5qR6/XS6E8lBoztATy3wqXPNQGh2F2ArsHl1LqHC1v9BPwGdS8o9tsNlEsFgX2x0mpVLqN1jf5yCEbR4hfa+AnHNKjqKwAAAAASUVORK5CYII="
const blackPawn_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKOgAACjoAUzZlgwAAAEZSURBVEhL7dU/TgJBFIDxRTCKiZ2JjZ1YSUJpoxaUVJzAU3gGW2sIhyEhxILCK9iRWBsDMYrfy741iG9mZ4fdxvAlv7wNxc7+J9m1q+pOMMALxrhBZdUxxWrNOy5RSR2sL5Z5RHB7OkM61LmZ63ezIgt+4Cvd/NVCZ6md4hXWJZWDuEOpPcBaLCNPbQOlNYO1UEbO8gy5hd7DfZ2+5LXJLXTBiU5Xcn/n6WY5neMN1uUU9wgq5Axr6MJ3ya5wnG5unxy9dVabnnCErbrFJ6wFLENEJ5fwGdaOXeRr1EZU17B2mmcEZ76Hpq+zaD0U+Ub/JO+edQYhnF8d35G0dMZ0ofNPvgXlc7aM1ISZvNSuDnTG5Prv/PclyTcNqYOiYik3TwAAAABJRU5ErkJggg=="
const blackBishop_small_base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAKQIAACkCAfgi1A0AAAIZSURBVEhL7da/SxthHAbwN80PqkNSWqlELA0pKM3STaX5DwouIZAoOmUTMmbL/9DBlhIc4ugQAioZ3KTQlnaRIBzSOoQ2aqhpqQ62pNHr81zekzO8uZyc6eQDH943by733vtN7s2J2/TIsPRfsgAn8AvmOTDI3AVOpktH4APHuSNbp+Ek7U7XyLlsHee6E3KCUqdrZBN4EQPJY3gLZjlN2/AIbjQTcAjdk5m+wRO4kQyBBpcTpNNpPZVKWSekXQiAbbyytcsSLLLj8XhEPB4XiURCRKNR0Ww2Rb1e51vMQziGT8YrF/kIxioCgYBeLBb1arVqKBQKus/ns67yHbjOGVhPqudyOUP3OHwH1zmAKycOhUJ6MBi8Mibtg+u8BtXJVV6BbTyytcsovI9EItFYLNYZ6YqmaaJWq31B9zk0jcEecTIhM4tf5noymVQeXyqVLsrl8gt0tzoj7sLNmVevKqEV79W+C+h7QCaTeZrNZjW/3y9H1Gm1WiKfz09UKhVeXM84KelMOBz+4PXa7xHtdls0Go1pdF3f+FzaG/gNqlIS71X+mvvuXKoVcuwBcMO+D9wfaQzm4BmY9f0LO7AG3Nz5ugU/YU+2tuEEG8A/WdVKruMPvARu/j2zCqoPW/FPmI8Zp7KvOsZqBS7TXdJJyMJX4Jf/Ay6AJeXtwZXz4YnlY1jme2C+x3LyKWIEpmAcluEz3GYQEeIfz4Hehc8um4AAAAAASUVORK5CYII="

export const sound_capture = "/files/sound_capture.mp3"
export const sound_move = "/files/sound_move.mp3"
export const sound_error = "/files/sound_error.mp3"

export const printBoardSVG = "/files/chessboard_print.svg"
export const fenViewerBoard = "/files/chessboard_fen.svg"

export const get_piece_src = (name, type = "standard") => {
  switch (type) {
      case "standard":
        switch (name) {
          case "white_king":
            return whiteKing_standard
          case "white_queen":
            return whiteQueen_standard
          case "white_rook":
            return whiteRook_standard
          case "white_bishop":
            return whiteBishop_standard
          case "white_knight":
            return whiteKnight_standard
          case "white_pawn":
            return whitePawn_standard
          case "black_king":
            return blackKing_standard
          case "black_queen":
            return blackQueen_standard
          case "black_rook":
            return blackRook_standard
          case "black_bishop":
            return blackBishop_standard
          case "black_knight":
            return blackKnight_standard
          case "black_pawn":
            return blackPawn_standard
          default:
            return undefined
        }
    case "small":
      switch (name) {
        case "white_king":
          return whiteKing_small
        case "white_queen":
          return whiteQueen_small
        case "white_rook":
          return whiteRook_small
        case "white_bishop":
          return whiteBishop_small
        case "white_knight":
          return whiteKnight_small
        case "white_pawn":
          return whitePawn_small
        case "black_king":
          return blackKing_small
        case "black_queen":
          return blackQueen_small
        case "black_rook":
          return blackRook_small
        case "black_bishop":
          return blackBishop_small
        case "black_knight":
          return blackKnight_small
        case "black_pawn":
          return blackPawn_small
        default:
          return undefined
      }
    case "small_base64":
      switch (name) {
        case "white_king":
          return whiteKing_small_base64
        case "white_queen":
          return whiteQueen_small_base64
        case "white_rook":
          return whiteRook_small_base64
        case "white_bishop":
          return whiteBishop_small_base64
        case "white_knight":
          return whiteKnight_small_base64
        case "white_pawn":
          return whitePawn_small_base64
        case "black_king":
          return blackKing_small_base64
        case "black_queen":
          return blackQueen_small_base64
        case "black_rook":
          return blackRook_small_base64
        case "black_bishop":
          return blackBishop_small_base64
        case "black_knight":
          return blackKnight_small_base64
        case "black_pawn":
          return blackPawn_small_base64
        default:
          return undefined
      }
    default:
      switch (name) {
        case "white_king":
          return whiteKing_standard
        case "white_queen":
          return whiteQueen_standard
        case "white_rook":
          return whiteRook_standard
        case "white_bishop":
          return whiteBishop_standard
        case "white_knight":
          return whiteKnight_standard
        case "white_pawn":
          return whitePawn_standard
        case "black_king":
          return blackKing_standard
        case "black_queen":
          return blackQueen_standard
        case "black_rook":
          return blackRook_standard
        case "black_bishop":
          return blackBishop_standard
        case "black_knight":
          return blackKnight_standard
        case "black_pawn":
          return blackPawn_standard
        default:
          return undefined
      }
  }
}