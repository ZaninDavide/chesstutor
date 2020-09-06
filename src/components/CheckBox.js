import React, { Component } from "react"
import Ripples from "react-ripples"

class CheckBox extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Ripples className="checkBoxContainer">
                <span onClick={this.props.click} style={{ display: "flex" }} >
                    <div className={"checkBox"}>
                        {this.props.checked ? "check_box" : "check_box_outline_blank"}
                    </div>
                &nbsp;
                {this.props.text}
                </span>
            </Ripples>
        )
    }
}

export default CheckBox
