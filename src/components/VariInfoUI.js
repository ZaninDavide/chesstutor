import React, { Component } from "react"
// import Translator from "./Translator";

class VariInfoUI extends Component {

    constructor(props) {
        super(props)

        this.state = {}
    }


    render() {
        return <>
            <h2>{this.props.vari_name}{this.props.vari_subname && (" " + this.props.vari_subname)}</h2>
        </>
    }
}

export default VariInfoUI
