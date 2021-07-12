import React, { Component } from "react"
import { make_san_nicer } from "../utilities/san_parsing"
import Translator from "./Translator";

const WHITE = -100
const BLACK = -200
const ALL = -300

class BookUI extends Component {

    constructor(props) {
        super(props)

        this.state = {
            opQuery: null,
            variQuery: null,
            subnameQuery: null,
        }

        this.getOptions = this.getOptions.bind(this);
        this.openingOptions = this.openingOptions.bind(this);
        this.groupOptions = this.groupOptions.bind(this);
        this.lineOptions = this.lineOptions.bind(this);
    }

    componentDidMount() {
        const op_index = this.props.match.params.op_index
        const vari_name = this.props.match.params.vari_name
        if (op_index !== undefined) {
            this.setState({opQuery: parseInt(op_index)})
        }
        if (vari_name !== undefined) {
            this.setState({variQuery: vari_name})
        }
    }

    getOptions() {
        let moves = this.props.get_correct_moves_data_book(this.props.json_moves, this.state.opQuery, this.state.variQuery, this.state.subnameQuery)
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
                        <td className="bookTableSan">{make_san_nicer(san)}</td>
                        <td>{op_name}</td>
                        <td>{varis}</td>
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
        let op = this.state.opQuery
        if(op === WHITE || op === BLACK || op === null || op === undefined || !this.props.ops[op]) return null;

        let vari_names = [] 

        this.props.ops[op].variations.forEach(vari => {
            if(!vari.archived){
                if(vari_names.indexOf(vari.vari_name) === -1) vari_names.push(vari.vari_name)
            }
        })

        vari_names.sort()

        return vari_names.map(v => <option value={v} key={"vari_"+v} className="bookQueryOption" >{v}</option>)
    }

    lineOptions() {
        let op = this.state.opQuery
        if(op === WHITE || op === BLACK || op === null || op === undefined || !this.props.ops[op]) return null;

        let vari_name = this.state.variQuery
        if(vari_name === null || vari_name === undefined) return null;

        let subnames = []
        
        this.props.ops[op].variations.forEach(vari => {
            if(vari.vari_name === vari_name && subnames.indexOf(vari.vari_subname) === -1) subnames.push(vari.vari_subname)
        })

        subnames.sort()

        return subnames.map(s => <option value={s} key={"subname_"+s} className="bookQueryOption" >{s}</option>)
    }

    render() {
        const queryToValue = (query) => {
            switch (query) {
                case true:
                    return WHITE.toString()
                    break;
                case false:
                    return BLACK.toString()
                    break;
                case null:
                    return ALL.toString()
                    break;
                case undefined:
                    return ALL.toString()
                    break;
                default:
                    return query
            }
        }
        return <React.Fragment>
            <table id="bookTable">
                <tbody>
                    {this.getOptions()}
                    <tr id="titleLineBookUI" key="titleLineBookUI">
                        <td><Translator text={"N°"}/></td>
                        <td><Translator text={"Move"}/></td>
                        <td>
                            <Translator text={"Opening"}/>
                        </td>
                        <td>
                            <Translator text={"Line"}/>
                        </td>
                    </tr>
                </tbody>
            </table>
            <br/>
            <h1><Translator text={"Filters"}/></h1>
            <table id="bookQueryTable"><tbody>
                <tr><td><Translator text={"Opening"}/>:</td><td>
                    <select className="bookQuerySelector opQuery"
                        onChange={e => {
                            if(e.target.value === WHITE.toString()){
                                this.setState({ opQuery: true, variQuery: null, subnameQuery: null })
                            }else if(e.target.value === BLACK.toString()){
                                this.setState({ opQuery: false, variQuery: null, subnameQuery: null })
                            }else if(e.target.value === ALL.toString()){
                                this.setState({ opQuery: null, variQuery: null, subnameQuery: null })
                            }else{
                                this.setState({ opQuery: parseInt(e.target.value), variQuery: null, subnameQuery: null })
                            }
                        }} 
                        value={queryToValue(this.state.opQuery)}
                    >
                        <option value={ALL} className="bookQueryOption" >{"⋅ All ⋅"}</option>
                        <option value={WHITE} className="bookQueryOption" >{"⋅ White ⋅"}</option>
                        <option value={BLACK} className="bookQueryOption" >{"⋅ Black ⋅"}</option>
                        {this.openingOptions()}
                    </select>    
                </td></tr>
                <tr><td><Translator text={"Line"}/>:</td><td>
                    <div style={{display: "block"}}>
                        <select className="bookQuerySelector variQuery"
                            onChange={e => {
                                if(e.target.value === ALL.toString()){
                                    this.setState({ variQuery: null, subnameQuery: null  })
                                }else{
                                    this.setState({ variQuery: e.target.value, subnameQuery: null  })
                                }
                            }} 
                            value={queryToValue(this.state.variQuery)}
                        >
                            <option value={ALL} className="bookQueryOption" >{"⋅ All ⋅"}</option>
                            {this.groupOptions()}
                        </select>
                        <select className="bookQuerySelector subnameQuery"
                            onChange={e => {
                                if(e.target.value === ALL.toString()){
                                    this.setState({ subnameQuery: null })
                                }else{
                                    this.setState({ subnameQuery: e.target.value })
                                }
                            }} 
                            value={queryToValue(this.state.subnameQuery)}
                        >
                            <option value={ALL} className="bookQueryOption" >{"⋅ All ⋅"}</option>
                            {this.lineOptions()}
                        </select>
                    </div>
                </td></tr>
            </tbody></table>
        </React.Fragment>
        
    }
}

export default BookUI
