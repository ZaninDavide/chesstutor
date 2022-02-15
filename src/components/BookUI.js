import React, { Component } from "react"
import { make_san_nicer_html } from "../utilities/san_parsing"
import TogglePanel from "./TogglePanel";
import Translator from "./Translator";

const WHITE = -100
const BLACK = -200
const ALL = -300

class BookUI extends Component {

    constructor(props) {
        super(props)

        this.getOptions = this.getOptions.bind(this);
        this.openingOptions = this.openingOptions.bind(this);
        this.groupOptions = this.groupOptions.bind(this);
        this.lineOptions = this.lineOptions.bind(this);
    }

    componentDidMount() {
        const op_index = this.props.op_index || (this.props.match ? this.props.match.params.op_index : null)
        const vari_name = this.props.match ? this.props.match.params.vari_name : null
        if (op_index !== undefined && op_index !== null) {
            this.props.set_book_query_op_index(parseInt(op_index))
        }
        if (vari_name !== undefined && vari_name !== null) {
            this.props.set_book_query_vari_name(vari_name)
        }
    }

    getOptions() {
        let moves = this.props.get_correct_moves_data_book(this.props.json_moves, this.props.opQuery, this.props.variQuery, this.props.subnameQuery)
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
                
                varis = varis.map((vari_name, vid) => {
                    // let vari_subnames = compacted_moves[san][op_name][vari_name]
                    // vari_subnames.sort()
                    // let vari_subnames_objects = vari_subnames.map(sub => <span className="impText" key={`vari_${san}_${op_name}_${vari_name}_${sub}`}>{sub + " "}</span>)

                    return <React.Fragment key={`varifrag_${san}_${op_name}_${vari_name}`}>{vid === 0 ? "" : " ⋅ "}{vari_name}</React.Fragment >
                })

                html.push(
                    <tr onClick={() => this.props.book_move(san)} key={`santr_${san}_${op_name}}`}>
                        <td key={`number_${number}_${san}`} className="bookTableNumber">{number}</td>
                        <td key={`san_${number}_${san}`} className="bookTableSan" dangerouslySetInnerHTML={{__html: make_san_nicer_html(san)}}></td>
                        <td key={`op_name_${number}_${san}`}>{op_name}</td>
                        <td key={`varis_${number}_${san}`}>{varis}</td>
                    </tr>
                )
            })
        })


        return html
    }

    openingOptions() {
        let sortable = this.props.ops.map((op, id) => {return {op: op, op_index: id}}) 
        sortable.sort((a, b) => a.op.op_name.localeCompare(b.op.op_name))

        return sortable.map(sop => {
            if(!sop.op.archived){            
                return <option value={sop.op_index} key={"op_"+sop.op_index} className="bookQueryOption" >{sop.op.op_name}</option>
            }else{
                return null
            }
        })
    }

    groupOptions() {
        let op = this.props.opQuery
        if(op === WHITE || op === BLACK || op === null || op === undefined || !this.props.ops[op]) return null;

        let vari_names = [] 

        this.props.ops[op].variations.forEach(vari => {
            if(!vari.archived){
                if(vari_names.indexOf(vari.vari_name) === -1) vari_names.push(vari.vari_name)
            }
        })

        vari_names.sort()

        return vari_names.map(v => <option value={v} key={"vari_"+v} className="bookQueryOption">{v}</option>)
    }

    lineOptions() {
        let op = this.props.opQuery
        if(op === WHITE || op === BLACK || op === null || op === undefined || !this.props.ops[op]) return null;

        let vari_name = this.props.variQuery
        if(vari_name === null || vari_name === undefined) return null;

        let subnames = []
        
        this.props.ops[op].variations.forEach(vari => {
            if(vari.vari_name === vari_name && subnames.indexOf(vari.vari_subname) === -1) subnames.push(vari.vari_subname)
        })

        subnames.sort()

        return subnames.map(s => <option value={s} key={"subname_"+s} className="bookQueryOption">{s}</option>)
    }

    render() {
        const queryToValue = (query) => {
            if(typeof(query) === "number" && isNaN(query)) return ALL.toString()
            switch (query) {
                case true:
                    return WHITE.toString()
                case false:
                    return BLACK.toString()
                case null:
                    return ALL.toString()
                case undefined:
                    return ALL.toString()
                case NaN:
                    return ALL.toString()
                default:
                    return query
            }
        }
        return <React.Fragment key="bookFragment">
            <table id="bookTable" key="bookTable">
                <tbody>
                    {this.getOptions()}
                    <tr id="titleLineBookUI" key="titleLineBookUI">
                        <td><Translator key="translatorN" text={"N°"}/></td>
                        <td><Translator key="translatorMove" text={"Move"}/></td>
                        <td>
                            <Translator key="translatorOpening" text={"Opening"}/>
                        </td>
                        <td>
                            <Translator key="translatorLine" text={"Line"}/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <TogglePanel title="Filters" panelName="bookFiltersPanel">
                <table id="bookQueryTable" key="bookQueryTable"><tbody>
                    <tr key="bookQueryTableTrOpening"><td><Translator key="translatorOpening" text={"Opening"}/>:</td><td>
                        <select className="bookQuerySelector opQuery" key="bookQueryTableOpeningSelector"
                            onChange={e => {
                                if(e.target.value === WHITE.toString()){
                                    this.props.set_book_query(true, null, null)
                                }else if(e.target.value === BLACK.toString()){
                                    this.props.set_book_query(false, null, null)
                                }else if(e.target.value === ALL.toString()){
                                    this.props.set_book_query(null, null, null)
                                }else{
                                    this.props.set_book_query(parseInt(e.target.value), null, null)
                                }
                            }} 
                            value={queryToValue(this.props.opQuery)}
                        >
                            <option value={ALL} className="bookQueryOption" key="bookQueryOptionOpAll">{"⋅ All ⋅"}</option>
                            <option value={WHITE} className="bookQueryOption" key="bookQueryOptionOpWhite">{"⋅ White ⋅"}</option>
                            <option value={BLACK} className="bookQueryOption" key="bookQueryOptionOpBlack">{"⋅ Black ⋅"}</option>
                            {this.openingOptions()}
                        </select>    
                    </td></tr>
                    <tr key="bookQueryTableTrLine"><td><Translator key="translatorLine" text={"Line"}/>:</td><td>
                        <div style={{display: "block"}}>
                            <select className="bookQuerySelector variQuery" key="bookQuerySelectorLine"
                                onChange={e => {
                                    if(e.target.value === ALL.toString()){
                                        this.props.set_book_query_vari_name(null)
                                        this.props.set_book_query_vari_subname(null)
                                    }else{
                                        this.props.set_book_query_vari_name(e.target.value)
                                        this.props.set_book_query_vari_subname(null)
                                    }
                                }} 
                                value={queryToValue(this.props.variQuery)}
                            >
                                <option value={ALL} className="bookQueryOption" key="bookQueryOptionLineAll">{"⋅ All ⋅"}</option>
                                {this.groupOptions()}
                            </select>
                            <select className="bookQuerySelector subnameQuery" key="bookQuerySelectorSubname"
                                onChange={e => {
                                    if(e.target.value === ALL.toString()){
                                        this.props.set_book_query_vari_subname(null)
                                    }else{
                                        this.props.set_book_query_vari_subname(e.target.value)
                                    }
                                }} 
                                value={queryToValue(this.props.subnameQuery)}
                            >
                                <option value={ALL} className="bookQueryOption" key="bookQueryOptionSubnameAll">{"⋅ All ⋅"}</option>
                                {this.lineOptions()}
                            </select>
                        </div>
                    </td></tr>
                </tbody></table>
            </TogglePanel>
        </React.Fragment>
        
    }
}

export default BookUI
