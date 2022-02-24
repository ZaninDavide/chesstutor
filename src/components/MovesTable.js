import React, { Component } from "react"
import { make_san_nicer_html } from "../utilities/san_parsing"
import Translator from "../components/Translator"

class MovesTable extends Component {
    constructor(props) {
        super(props)

        this.moves_list = this.moves_list.bind(this)
    }

    moves_list() {
        let htmls = []
        
        let last_move = null;

        let sans = this.props.json_moves.map(m => m.san).join("|")

        const json_moves_length = this.props.json_moves.length
        
        // moves done
        for(let i = 0; i < json_moves_length; i++) {
            let m = this.props.json_moves[i]
            let counter = (i + 1) / 2
            if(last_move === null) {
                last_move = m
            }else{
                htmls.push(<div className="movesCouple" key={"moves_couple_" + counter + "_" + sans}>
                    <div key={"move_numer_" + i}>
                        {counter}
                    </div>
                    <div onClick={() => {
                        this.props.try_undo_n_times(json_moves_length - i)
                    }} dangerouslySetInnerHTML={{__html:make_san_nicer_html(last_move.san)}}></div>
                    <div onClick={() => {
                        this.props.try_undo_n_times(json_moves_length - i - 1)
                    }} dangerouslySetInnerHTML={{__html:make_san_nicer_html(m.san)}}></div>
                </div>)
                last_move = null
            }
        }

        const moves_forward_length = this.props.moves_forward.length

        // moves_forward (the once you undid)
        for(let i = json_moves_length; i < json_moves_length + moves_forward_length; i++) {
            let m = this.props.moves_forward[i - json_moves_length]
            let counter = (i + 1) / 2
            if(last_move === null) {
                last_move = m
            }else{
                let cname1 = i === json_moves_length ? "" : "moveForward"
                htmls.push(<div className="movesCouple" key={"moves_couple_" + counter}>
                    <div key={"move_numer_" + i}>
                        {counter}
                    </div>
                    <div className={cname1} onClick={() => {
                        this.props.try_redo_n_times(i - json_moves_length)
                    }} dangerouslySetInnerHTML={{__html:make_san_nicer_html(last_move.san)}}></div>
                    <div className="moveForward" onClick={() => {
                        this.props.try_redo_n_times(i + 1 - json_moves_length)
                    }} dangerouslySetInnerHTML={{__html:make_san_nicer_html(m.san)}}></div>
                </div>)
                last_move = null
            }
        }

        let counter = (json_moves_length + moves_forward_length + 1) / 2
        if(last_move !== null) {
            let cname = (moves_forward_length ? " moveForward" : "")
            let onclick = (moves_forward_length ? () => {
                this.props.try_redo_n_times(moves_forward_length)
            } : undefined)
            htmls.push(<div className={"movesCouple"} key={"moves_couple_" + counter + "_" + sans}>
                <div>{counter}</div>
                <div className={cname} onClick={onclick} dangerouslySetInnerHTML={{__html:make_san_nicer_html(last_move.san)}}></div>
                <div></div>
            </div>)
        }

        return htmls;
    }

    render() { 
        return <div id="movesTable">
            <div className="movesCouple" key={"movesTableHeader"}>
                <div>#</div>
                <div><Translator text="White" /></div>
                <div><Translator text="Black" /></div>
            </div>
            {this.moves_list()}
        </div>
    }
}

export default MovesTable