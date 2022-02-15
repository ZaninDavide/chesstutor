import React, { Component } from "react"
import "../styles/Modal.css"
import Modal from "../components/Modal"
import Translator from "../components/Translator"



class RenameVariModal extends Component {
  constructor(props) {
    super(props)
    this.close = this.close.bind(this);

    this.state = {
      variOriginalName: this.props.thisVari ? this.props.thisVari.vari_name : "",
      variOriginalSubname: this.props.thisVari ? this.props.thisVari.vari_subname : "",
      variNewName: this.props.thisVari ? this.props.thisVari.vari_name : "",
      variNewSubname: this.props.thisVari ? this.props.thisVari.vari_subname : "",
    }

    this.selectRef = React.createRef();
    this.getSubnameOptions = this.getSubnameOptions.bind(this);
  }

  close() {
    this.props.close()
  }

  UNSAFE_componentWillReceiveProps (props) {
    const new_variOriginalName = props.thisVari ? props.thisVari.vari_name : ""
    const new_variOriginalSubname = props.thisVari ? props.thisVari.vari_subname : ""
    if (new_variOriginalName !== this.state.variOriginalName || new_variOriginalSubname !== this.state.variOriginalSubname){
      this.setState({
        variOriginalName: new_variOriginalName,
        variOriginalSubname: new_variOriginalSubname,
        variNewName: new_variOriginalName,
        variNewSubname: new_variOriginalSubname,
      })
      this.selectRef.current.value = new_variOriginalSubname
    }
  }

  getSubnameOptions() {
    let subns = this.props.getOpFreeSubnames(26*4, this.props.op_index, this.state.variNewName, false)
    if(this.state.variNewName === this.props.thisVari.vari_name){
      // if the name is the same allow to keep the same subname
      subns = [this.props.thisVari.vari_subname, ...subns]
    }
    return subns.map(subn => 
      <option value={subn} className="subNameOption" key={"subNameOption_" + subn}>{subn}</option>
    )
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        close={this.close}
        onDoneClick={() => this.props.renameThisVari(this.state.variNewName, this.state.variNewSubname)}
        disabledDoneButton={this.state.variNewName.length === 0}
      >
            <h2>
              <Translator text={"Rename"} />&nbsp;
                <span style={{ color: "var(--main)" }}>
                
                {this.state.variOriginalName}{this.state.variOriginalSubname ? (" " + this.state.variOriginalSubname) : ""}
              </span>&nbsp;
                <Translator text={"to:"} />&nbsp;
              </h2>
            <input type="text"
              id="renameVariTextbox"
              className="textBox renameTextBox"
              value={this.state.variNewName}
              onChange={e => this.setState({ variNewName: e.target.value })}
              onKeyPress={e => {
                if (e.which === 13 || e.keyCode === 13) {
                  this.props.renameThisVari(this.state.variNewName, this.state.variNewSubname)
                  this.close()
                }
              }}
            />
            <select
              id="subNameSelector"
              onChange={e => this.setState({ variNewSubname: e.target.value })} 
              defaultValue={this.state.variOriginalSubname}
              ref={this.selectRef} 
            >
              {/*<option value={undefined} className="subNameOption"></option>*/}
              {this.props.visible ? this.getSubnameOptions() : null}
            </select>
      </Modal>
    )
  }

}
export default RenameVariModal
