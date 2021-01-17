import React, { Component } from "react"
import CheckBox from "../components/CheckBox"
import Translator from "../components/Translator"
import Ripples from "react-ripples"

class BookUI extends Component {

    constructor(props) {
        super(props)
        this.getOptions = this.getOptions.bind(this);
    }

    getOptions() {
        let moves = this.props.get_correct_moves_data_book(this.props.json_moves)
        let number = this.props.json_moves.length
        if(number % 2 !== 0) { 
            number = (Math.floor(number/2) + 1) + " ..."
        }else{
            number = (number/2 + 1) + "."
        }


        let compacted_moves = {}

        moves.forEach(m => {
            if(compacted_moves[m.san]){
                if(compacted_moves[m.san][m.op_name]){
                    if(compacted_moves[m.san][m.op_name][m.vari_name]){
                        // same san, same op_name and same vari_name
                        compacted_moves[m.san][m.op_name][m.vari_name].push(m.vari_subname)
                    }else{
                        compacted_moves[m.san][m.op_name][m.vari_name] = []
                        compacted_moves[m.san][m.op_name][m.vari_name].push(m.vari_subname)
                    }
                }else{
                    // the move is the same but it's the first time we find it in this opening
                    compacted_moves[m.san][m.op_name] = {}
                    compacted_moves[m.san][m.op_name][m.vari_name] = []
                    compacted_moves[m.san][m.op_name][m.vari_name].push(m.vari_subname)
                }
            }else{
                // this is the first time we find this move at all
                compacted_moves[m.san] = {}
                compacted_moves[m.san][m.op_name] = {}
                compacted_moves[m.san][m.op_name][m.vari_name] = []
                compacted_moves[m.san][m.op_name][m.vari_name].push(m.vari_subname)
            }
        })

        let html = []

        Object.keys(compacted_moves).forEach(san => {
            let ops = Object.keys(compacted_moves[san])
            ops.sort()

            ops.forEach(op_name => {

                let varis = Object.keys(compacted_moves[san][op_name])
                varis.sort()
                
                varis = varis.map(vari_name => {
                    let vari_subnames = compacted_moves[san][op_name][vari_name]
                    vari_subnames.sort()

                    return <>{vari_name + " "}{vari_subnames.map(sub => <span className="impText">{sub + " "}</span>)}</>
                })

                html.push(
                    <tr onClick={() => this.props.book_move(san)}>
                        <td className="bookTableNumber">{number}</td>
                        <td className="bookTableSan">{san}</td>
                        <td>{op_name}</td>
                        <td>{varis}</td>
                    </tr>
                )
            })
        })


        return html
    }

    render() {
        return <table id="bookTable">
                <tbody>
                    {this.getOptions()}
                    <tr id="titleLineBookUI" key="titleLineBookUI"><td>N°</td><td>Move</td><td>Opening</td><td>Variation</td></tr>
                </tbody>
        </table>
    }
}

export default BookUI
