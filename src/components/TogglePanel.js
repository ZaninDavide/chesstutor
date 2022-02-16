import React, { Component } from "react"
import Translator from "./Translator"

class TogglePanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            panelVisible: props.startOpen,
        }
    }

    render() { return (<div className="togglePanelContainer">
        <h2 key="titleTogglePanel" onClick={() => this.setState(old => { return{panelVisible: !old.panelVisible} })}>
            <div
                id={`togglePanelChevron_${this.props.panelName}`} 
                style={{"textTransform": "none"}} 
                className={"iconText togglePanelChevron" + (this.state.panelVisible ? " panel_chevron_rotated" : "")}
            >chevron_right</div>
            <Translator text={this.props.title}/>
        </h2>
        <div id={`togglePanel_${this.props.panelName}`} key={`togglePanel_${this.props.panelName}`} 
            className={ this.state.panelVisible ? 
                "togglePanel togglePanel_visible" : "togglePanel togglePanel_hidden"
            }
        >
            {this.props.children}
        </div>
    </div>)}
}

export default TogglePanel