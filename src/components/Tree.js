import React, { Component } from "react"
import { make_san_nicer } from "../utilities/san_parsing"

class Tree extends Component {

    constructor(props){
        super(props)
        this.tree = this.tree.bind(this)
    }

    tree(){
        return this.props.json_moves.map(c => make_san_nicer(c.san)).join(" ")
    }

    render() {
        return <div id="movesTree" key="movesTree">
            {this.props.json_moves ? this.tree() : null}
        </div>
    }
}

export default Tree
