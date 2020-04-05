import React, { Component } from "react"
import "../styles/Modal.css"
import Modal from "../components/Modal"
import Translator from "../components/Translator"



class RenameVariModal extends Component {
  constructor(props) {
    super(props)
    this.getStyle = this.getStyle.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      variNewName: this.props.thisVari ? this.props.thisVari.vari_name : "",
      variNewSubname: this.props.thisVari ? this.props.thisVari.vari_subname : ""
    }
  }

  getStyle(){
    return {
      display: this.props.visible ? "block" : "none",
      backgroundColor: this.props.visible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
    }
  }

  close(){
    this.props.close()
  }

  render() {
    return (
      <Modal 
          visible={this.props.visible} 
          close={this.close} 
          onDoneClick={() => this.props.renameThisVari(this.state.variNewName, this.state.variNewSubname)} 
          disabledDoneButton={this.state.variNewName.length === 0}
        >
          { this.props.visible ? 
            <React.Fragment>
              <h2>
                <Translator text={"Rename"} />&nbsp;
                <span style={{color: "var(--impButtonBack)"}}>{this.props.thisVari.vari_name}</span>&nbsp;
                <Translator text={"to:"} />&nbsp;
              </h2>
              <input type="text" 
                id="renameVariTextbox"
                className="textBox renameTextBox"
                value={this.state.variNewName} 
                onChange={e => this.setState({variNewName: e.target.value})}
                onKeyPress={e => {
                  if (e.which === 13 || e.keyCode === 13) {
                    this.props.renameThisVari(this.state.variNewName, this.state.variNewSubname)
                    this.close()
                  }
                }}
              />
              <select 
                id="subNameSelector" 
                onChange={e => this.setState({variNewSubname: e.target.value})} defaultValue={this.state.variNewSubname}
              >
                <option value={undefined} className="subNameOption"></option>
                <option value="A" className="subNameOption" >A</option>
                <option value="B" className="subNameOption" >B</option>
                <option value="C" className="subNameOption" >C</option>
                <option value="D" className="subNameOption" >D</option>
                <option value="E" className="subNameOption" >E</option>
                <option value="F" className="subNameOption" >F</option>
                <option value="G" className="subNameOption" >G</option>
                <option value="H" className="subNameOption" >H</option>
                <option value="I" className="subNameOption" >I</option>
                <option value="J" className="subNameOption" >J</option>
                <option value="K" className="subNameOption" >K</option>
                <option value="L" className="subNameOption" >L</option>
                <option value="M" className="subNameOption" >M</option>
                <option value="N" className="subNameOption" >N</option>
                <option value="O" className="subNameOption" >O</option>
                <option value="P" className="subNameOption" >P</option>
                <option value="Q" className="subNameOption" >Q</option>
                <option value="R" className="subNameOption" >R</option>
                <option value="S" className="subNameOption" >S</option>
                <option value="T" className="subNameOption" >T</option>
                <option value="U" className="subNameOption" >U</option>
                <option value="V" className="subNameOption" >V</option>
                <option value="W" className="subNameOption" >W</option>
                <option value="X" className="subNameOption" >X</option>
                <option value="Y" className="subNameOption" >Y</option>
                <option value="Z" className="subNameOption" >Z</option>

                <option value="A2" className="subNameOption" >A2</option>
                <option value="B2" className="subNameOption" >B2</option>
                <option value="C2" className="subNameOption" >C2</option>
                <option value="D2" className="subNameOption" >D2</option>
                <option value="E2" className="subNameOption" >E2</option>
                <option value="F2" className="subNameOption" >F2</option>
                <option value="G2" className="subNameOption" >G2</option>
                <option value="H2" className="subNameOption" >H2</option>
                <option value="I2" className="subNameOption" >I2</option>
                <option value="J2" className="subNameOption" >J2</option>
                <option value="K2" className="subNameOption" >K2</option>
                <option value="L2" className="subNameOption" >L2</option>
                <option value="M2" className="subNameOption" >M2</option>
                <option value="N2" className="subNameOption" >N2</option>
                <option value="O2" className="subNameOption" >O2</option>
                <option value="P2" className="subNameOption" >P2</option>
                <option value="Q2" className="subNameOption" >Q2</option>
                <option value="R2" className="subNameOption" >R2</option>
                <option value="S2" className="subNameOption" >S2</option>
                <option value="T2" className="subNameOption" >T2</option>
                <option value="U2" className="subNameOption" >U2</option>
                <option value="V2" className="subNameOption" >V2</option>
                <option value="W2" className="subNameOption" >W2</option>
                <option value="X2" className="subNameOption" >X2</option>
                <option value="Y2" className="subNameOption" >Y2</option>
                <option value="Z2" className="subNameOption" >Z2</option>

                <option value="A3" className="subNameOption" >A3</option>
                <option value="B3" className="subNameOption" >B3</option>
                <option value="C3" className="subNameOption" >C3</option>
                <option value="D3" className="subNameOption" >D3</option>
                <option value="E3" className="subNameOption" >E3</option>
                <option value="F3" className="subNameOption" >F3</option>
                <option value="G3" className="subNameOption" >G3</option>
                <option value="H3" className="subNameOption" >H3</option>
                <option value="I3" className="subNameOption" >I3</option>
                <option value="J3" className="subNameOption" >J3</option>
                <option value="K3" className="subNameOption" >K3</option>
                <option value="L3" className="subNameOption" >L3</option>
                <option value="M3" className="subNameOption" >M3</option>
                <option value="N3" className="subNameOption" >N3</option>
                <option value="O3" className="subNameOption" >O3</option>
                <option value="P3" className="subNameOption" >P3</option>
                <option value="Q3" className="subNameOption" >Q3</option>
                <option value="R3" className="subNameOption" >R3</option>
                <option value="S3" className="subNameOption" >S3</option>
                <option value="T3" className="subNameOption" >T3</option>
                <option value="U3" className="subNameOption" >U3</option>
                <option value="V3" className="subNameOption" >V3</option>
                <option value="W3" className="subNameOption" >W3</option>
                <option value="X3" className="subNameOption" >X3</option>
                <option value="Y3" className="subNameOption" >Y3</option>
                <option value="Z3" className="subNameOption" >Z3</option>
              </select>
            </React.Fragment> : null
          }
        </Modal>
    )
  }

}
export default RenameVariModal
