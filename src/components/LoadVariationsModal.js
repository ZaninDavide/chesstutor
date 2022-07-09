import React, { Component } from "react"
import "../styles/Modal.css"
import Chess from "../chessjs-chesstutor/chess"

const pgnExample = "1. e4 d5 2. exd5 Qxd5 3. Nc3 (3. Nf3 Bg4 (3... Nc6 4. d4) 4. Be2 Nc6 5. O-O) 3... Qa5 4. d4 Nf6"


class LoadVariationsModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: "",
    }
    this.onDone = this.onDone.bind(this);
    this.game_to_variations = this.game_to_variations.bind(this);
  }

  onDone() {
    let varis = this.game_to_variations(this.state.text)
    console.log(varis)
    let game = new Chess()
    let err = false;
    let new_varis = [];
    // TODO: this code is inefficient because we go thorugh many moves twice
    varis.forEach(v => {
      game.reset();
      // start new variation
      let new_json_vari = [];
      // play each move
      for(let i = 0; i<v.length; i++) {
        let move = game.move(v[i], {unsafe_san_parsing: false})        
        if(move === null){
          console.log("error: ", v[i])
          err = true;
          break;
        }else{
          new_json_vari.push({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
            san: move.san,
          })
        }
      }
      // add this vari to the list
      if(!err) new_varis.push(new_json_vari);
    })
    if(err) {
      this.props.notify("This PGN contains invalid moves. Some variations where therefore omitted.", "error");
    }else{
      this.props.addVariations(new_varis)
    }
    this.props.close()
  }

  /*
  1. e4 d5 2. exd5 Qxd5 3. Nc3 (3. Nf3 Bg4 (3... Nc6 4. d4) 4. Be2 Nc6 5. O-O (5. d4 O-O-O) 5... O-O-O 6. Nc3 Qd7 7. b4 Nf6 8. b5 Bxf3 9. Bxf3 Nd4 10. a4 Qf5) ( 3. d4 Nf6 4. Nc3) (3. c4 Qe4+ 4. Qe2 Qxe2+ 5. Bxe2 Nc6) 3... Qa5 (3... Qd8 4. d4 Nf6 5. Nf3 Bg4 6. Bc4 e6 7. O-O Nc6) (3... Qd6 4. d4 Nf6 5. Nf3 a6 6. Be2 Nc6 7. O-O Bf5 8. Be3 O-O-O) 4. d4 (4. Bc4 Nf6 5. Nf3 Bg4 6. O-O e6) (4. b4 Qxb4 5. Rb1 Qd6 6. d4 Nf6 7. g3 Nc6) (4. Nf3 Nf6 5. Bc4 Bg4 6. O-O Nc6) 4... Nf6 5. Nf3 (5. Bd2 c6 6. Nf3 Bg4 7. Bc4 e6 8. O-O Qc7 9. Re1 Be7) 5... Bg4 (5... Bf5 6. Bc4 e6 7. Bd2 c6 8. O-O Qc7 9. Re1 Be7 10. Rc1 Nbd7) 6. h3 Bh5 7. Be2 (7. g4 Bg6 8. Ne5 e6 9. h4) 7... Nc6 8. O-O O-O-O 9. Be3 e5
  */
  game_to_variations(text) {
    // I want to extract from text all possible ways of ending the game, so all possible variations

    // remove move numbers
    text = text.replace(/\n+/gm, " ").replace(/[0-9]+\.+\s*/gm, "").replace(/\(\s/gm, "(").trim();
    // e4 d5 exd5 Qxd5 Nc3 (Nf3 Bg4 (Nc6 d4) Be2 Nc6 O-O (d4 O-O-O) O-O-O Nc3 Qd7 b4 Nf6 b5 Bxf3 Bxf3 Nd4 a4 Qf5) ( d4 Nf6 Nc3) (c4 Qe4+ Qe2 Qxe2+ Bxe2 Nc6) Qa5 (Qd8 d4 Nf6 Nf3 Bg4 Bc4 e6 O-O Nc6) (Qd6 d4 Nf6 Nf3 a6 Be2 Nc6 O-O Bf5 Be3 O-O-O) d4 (Bc4 Nf6 Nf3 Bg4 O-O e6) (b4 Qxb4 Rb1 Qd6 d4 Nf6 g3 Nc6) (Nf3 Nf6 Bc4 Bg4 O-O Nc6) Nf6 Nf3 (Bd2 c6 Nf3 Bg4 Bc4 e6 O-O Qc7 Re1 Be7) Bg4 (Bf5 Bc4 e6 Bd2 c6 O-O Qc7 Re1 Be7 Rc1 Nbd7) h3 Bh5 Be2 (g4 Bg6 Ne5 e6 h4) Nc6 O-O O-O-O Be3 e5

    let ready_vars = []
    let active_vars = [[]] // start with one empty variation
  
    let san = ""

    text.split("").forEach(letter => {
        switch (letter) {
            case "(":
                // add this san to the current variation
                if(active_vars.length > 0 && san) active_vars[active_vars.length - 1].push(san)
                san = ""
                // start a new variation from this point
                if(active_vars.length > 0){
                    let new_vari = [...active_vars[active_vars.length - 1]]
                    new_vari.pop() // the variation starts from the move before
                    active_vars.push(new_vari)
                }else{
                    active_vars.push([])
                }
                break;
            case ")":
                // add this san to the current variation
                if(active_vars.length > 0 && san) active_vars[active_vars.length - 1].push(san)
                san = ""
                // end this variation
                if(active_vars.length > 0) ready_vars.push(active_vars.pop())
                break;
            case " ":
                // add this san to the current variation
                if(active_vars.length > 0 && san) active_vars[active_vars.length - 1].push(san)
                san = ""
                break;
            default:
                san += letter
                break;
        }
    });

    if(active_vars.length > 0) {
        if(active_vars.length > 0 && san) active_vars[active_vars.length - 1].push(san)
        ready_vars.push(active_vars.pop())
    }

    if(active_vars.length !== 0) {
      this.props.notify("Incomplete lines found were found inside this PGN.", "error")
      console.log("Incomplete lines found were found inside this PGN.")
    }

    return ready_vars
  }

  render() {
    return (
      <div id="commentModal" className={"modal" + (this.props.visible ? " modalVisible" : " modalHidden")} onClick={this.props.close}>
        <div className="modalContent tallModalContent" onClick={e => e.stopPropagation()}>
          <div className="insideModal insideCommentModal" onClick={e => e.stopPropagation()}>
            <textarea placeholder={pgnExample} onChange={e => this.setState({ text: e.target.value })} className="commentTextBox" type="text" value={this.state.text}></textarea>
          </div>
          <div className="modalButtons" style={{ textAlign: "right" }}>
            <button className="modalButton simpleButton iconText"
              disabled={this.props.disabledDoneButton}
              onClick={this.onDone}
            >add</button>
            <button className="simpleButton modalBackButton"
              onClick={() => {
                this.props.close()
              }}
            ><span className="iconText">close</span></button>
          </div>
        </div>
      </div>
    )
  }

}

export default LoadVariationsModal
