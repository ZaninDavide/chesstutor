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
    this.onDone = this.onDone.bind(this);
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
    let trimmedVariNewName = this.state.variNewName.trim();
    let subns = this.props.getOpFreeSubnames(26*4, this.props.op_index, trimmedVariNewName, false)
    if(trimmedVariNewName === this.props.thisVari.vari_name){
      // if the name is the same allow to keep the same subname
      subns = [this.props.thisVari.vari_subname, ...subns]
    }
    return subns.map(subn => 
      <option value={subn} className="subNameOption" key={"subNameOption_" + subn}>{subn}</option>
    )
  }

  onDone() {
    if(!this.state.variNewName || this.state.variNewName.trim().length < 1){
      console.log("RenameVariModal: variation name shouldn't be empty, null or undefined");
      return;
    }
    if(
      this.state.variNewName === this.state.variOriginalName &&
      this.state.variNewSubname === this.state.variOriginalSubname
    ){
      // nothing to do in this case
      return;
    }

    let trimmedVariNewName = this.state.variNewName.trim();

    // check subname is available
    let subns = this.props.getOpFreeSubnames(26*4, this.props.op_index, trimmedVariNewName, false)
    if(subns.includes(this.state.variNewSubname)){
      this.props.renameThisVari(trimmedVariNewName, this.state.variNewSubname)
    }else{
      console.log("RenameVariModal: this variation subname is not available because already used. Fallen back to first available subname.");
      this.props.renameThisVari(trimmedVariNewName, subns[0])
    }
  }

  render() {
    let trimmedVariNewName = this.state.variNewName ? this.state.variNewName.trim() : this.state.variNewName;
    return (
      <Modal
        visible={this.props.visible}
        close={this.close}
        onDoneClick={this.onDone}
        disabledDoneButton={
          !this.state.variNewName || trimmedVariNewName.length < 1
        }
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
              onChange={e => {this.setState({ variNewName: e.target.value })}}
              onKeyPress={e => {
                if (e.which === 13 || e.keyCode === 13) {
                  this.onDone()
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
