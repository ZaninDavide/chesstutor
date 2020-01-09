import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import OpeningPage from "./pages/OpeningPage"
import CreateVariPage from "./pages/CreateVariPage"
import RevisePage from "./pages/RevisePage"
import OpsListPage from "./pages/OpsListPage"
import VariationPage from "./pages/VariationPage"
import NewOpPage from "./pages/NewOpPage"
import LoginPage from "./pages/LoginPage"
import NewVariPage from "./pages/NewVariPage"
import TrainingPage from "./pages/TrainingPage"

import "./styles/App.css" // css by CLASSES + MAIN COMPONENTS
import "./styles/Elements.css" // css by ID + SECONDARY COMPONENTS
import { LanguageProvider } from "./components/LanguageContext"

const defaultOps = [
  {
    op_name: "Formaggio",
    op_color: "white",
    variations: [
      {
        vari_name: "Classic",
        vari_score: 0,
        archived: true,
        moves: [{ from: "d2", to: "d4", promotion: undefined, san: "d4", comment: "That's the first move, don't forget it."}] // , fen: "" 
      }
    ],
    archived: false
  }
]

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: undefined,
      username: undefined,
      bearer: undefined,
      user_ops: [],
      language: "eng",
      colorTheme: "defaultTheme"
    }
    this.createOp = this.createOp.bind(this)
    this.addOpening = this.addOpening.bind(this)
    this.createVari = this.createVari.bind(this)
    this.addVariation = this.addVariation.bind(this)
    this.updateDB = this.updateDB.bind(this)
    this.getUserData = this.getUserData.bind(this)
    this.setBearer = this.setBearer.bind(this)
    this.logout = this.logout.bind(this)
    this.deleteOpening = this.deleteOpening.bind(this)
    this.switchArchivedOpening = this.switchArchivedOpening.bind(this)
    this.switchVariArchived = this.switchVariArchived.bind(this)
    this.renameOp = this.renameOp.bind(this)
    this.renameVari = this.renameVari.bind(this)
    this.deleteVari = this.deleteVari.bind(this)
    this.is_move_allowed = this.is_move_allowed.bind(this)
    // write the remember me part
  }

  /* ----------------------------     FUNCTIONS     ---------------------------- */
  /* ---------------------------- DATABASE & SERVER ---------------------------- */
    
  async getUserData(){
    if(this.state.bearer){
      let userData = await fetch(
          "https://chesstutorserver.herokuapp.com/user",
          {
              headers: {
                  Authorization: "Bearer " + this.state.bearer,
              },
          }
      ).then(res => res.json())

      this.setState(() => {
        let ops = userData.user_ops
        console.log(ops)
        // NEW USER
        // if this is a new user give it the default openings 
        if (ops === undefined){
          this.updateDB(defaultOps) // add them to the database
          ops = defaultOps
          console.log("You have recived the default datapack")
        }

        return {
          user_ops: ops,
          _id: userData._id,
          username: userData.email
        }
      })
    }else{
      console.log("Log in before looking for user data")
    }
  }

  setBearer = async (bearer, redirectTo = "/") => {
    this.setState({ bearer, redirectTo })
    localStorage.setItem("bearer", bearer)
    this.getUserData()
  }

  logout = () => {
    localStorage.removeItem("bearer")
    this.setState({ bearer: null, redirectTo: "/login", decks: [] })
  }

  updateUserData = (newUserData, bearer, refresh = true) => {
    fetch("https://chesstutorserver.herokuapp.com/user", {
        body: JSON.stringify(newUserData),
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + bearer,
        },
        method: "POST",
    })

    // probabilmente non ti serve
    // if (refresh) this.forceUpdate()
  }


  updateDB(new_ops = this.state.user_ops) {
    /*if (new_ops.toString() !== this.state.user_ops.toString()) {
      // Warning you that you are saving in the database something that is different from what the user sees now
      console.log("updateDB: database and state won't match. the database will be updated aniway")
    }*/
    this.updateUserData({user_ops: new_ops}, this.state.bearer)
  }

  /* ---------------------------- OPENINGS ---------------------------- */
  newOpening(op_name = "New opening", op_color = "white") {
    // generates a new opening
    // WARN: it doesn't add it to user_ops. To do that use addOpening
    return {
      op_name: op_name,
      op_color: op_color,
      variations: [],
      archived: false,
    }
  }

  addOpening(op_object) {
    if (op_object.op_name !== undefined && op_object.op_color !== undefined) {
      /* Update state and database */
      const op_index = this.state.user_ops.length // index of the new opening
      this.state.user_ops.push(op_object)
      this.updateDB()
      return op_index
    } else {
      console.log("addOpening: Can't add an opening without op_name or user_color")
      return false
    }
  }

  createOp(new_op_name, studyAs){
    return this.addOpening(this.newOpening(new_op_name, studyAs))
  }

  deleteOpening(op_index){
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops.splice(op_index, 1)
      this.updateDB(new_user_ops)
      return {user_ops: new_user_ops}
    })
  }

  switchArchivedOpening(op_index){
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].archived = !new_user_ops[op_index].archived
      this.updateDB(new_user_ops)
      return {user_ops: new_user_ops}
    })
  }

  renameOp(op_index, op_new_name){
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].op_name = op_new_name
      this.updateDB(new_user_ops)
      return {user_ops: new_user_ops}
    })
  }

  /* ---------------------------- VARIATIONS ---------------------------- */

  newVariation(vari_name = "Classic", vari_moves = []){
    // generates a new variation (returns a vari_object)
    // WARN: it doesn't add it. To do that use addVariation
    return {
      vari_name: vari_name,
      vari_score: 0,
      moves: vari_moves,
      archived: false,
    }
  }

  addVariation(vari_object, op_index){
    if(vari_object.vari_name !== undefined){
      /* Update state and database */
      const vari_index = this.state.user_ops[op_index].variations.length // index of the new variation
      this.state.user_ops[op_index].variations.push(vari_object)
      this.updateDB()
      return vari_index
    }else {
      console.log("addVariation: Can't add an variation without its name")
      return false
    }
  }

  createVari(new_vari_name, vari_moves, op_index){
    return this.addVariation(this.newVariation(new_vari_name, vari_moves), op_index)
  }

  switchVariArchived(op_index, vari_index){
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations[vari_index].archived = !new_user_ops[op_index].variations[vari_index].archived
      this.updateDB(new_user_ops)
      return {user_ops: new_user_ops}
    })
  }

  renameVari(op_index, vari_index, vari_new_name){
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations[vari_index].vari_name = vari_new_name
      this.updateDB(new_user_ops)
      return {user_ops: new_user_ops}
    })
  }

  deleteVari(op_index, vari_index){
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations.splice(vari_index, 1)
      this.updateDB(new_user_ops)
      return {user_ops: new_user_ops}
    })
  }

  /* --------------------------- TRAINING --------------------------- */

  is_move_allowed(op_index, json_moves, move_data){
    let is_allowed = false
    let finished_training = true
    let op = this.state.user_ops[op_index]
    for(let vari_index = 0; vari_index<op.variations.length; vari_index++){
      // loop through all variations 
      let vari = op.variations[vari_index]
      if(vari.moves.length > json_moves.length && !vari.archived){ // this variation is long enougth and not archived
        let first_moves = vari.moves.slice(0, json_moves.length)

        // is the variation compatible with the already done moves?
        if(JSON.stringify(first_moves) === JSON.stringify(json_moves)){
          finished_training = false // there is at least one move to do
          let vari_next_move = vari.moves[json_moves.length] // take the next move

          // is it the move I'm going to do?
          if(vari_next_move.from === move_data.from && vari_next_move.to === move_data.to && vari_next_move.promotion === move_data.promotion){
            is_allowed = true
            break;
          }
        }

      }
    }
    if(finished_training){
      alert("training finished") // TODO
      return false
    }
    return is_allowed
  }

  /* ---------------------------- RENDER ---------------------------- */
  render() {
    const opsListPage = ({ history }) =>  <OpsListPage 
                                            ops={this.state.user_ops} 
                                            history={history} 
                                            updateDB={this.updateUserData} 
                                            deleteOpening={this.deleteOpening} 
                                            switchArchivedOpening={this.switchArchivedOpening}
                                            renameOp={this.renameOp}
                                          />
    const opPage = ({ match, history }) =>  <OpeningPage 
                                              ops={this.state.user_ops} 
                                              history={history} 
                                              match={match} 
                                              switchVariArchived={this.switchVariArchived}
                                              renameVari={this.renameVari}
                                              deleteVari={this.deleteVari}
                                            />
    const trainingPage = ({ match, history }) =>  <TrainingPage 
                                                    history={history} 
                                                    match={match} 
                                                    ops={this.state.user_ops}
                                                    is_move_allowed={this.is_move_allowed}
                                                  />
    const variPage = ({ match, history }) => <VariationPage ops={this.state.user_ops} history={history} match={match} createVari={this.createVari}/>
    const newVariPage = ({ match, history }) => <NewVariPage ops={this.state.user_ops} history={history} match={match} createVari={this.createVari}/>
    const newOpPage = ({ match, history }) => <NewOpPage history={history} match={match} createOp={this.createOp}/>
    const loginPage = ({ match, history }) => <LoginPage history={history} match={match} setBearer={this.setBearer}/>

    return (
      <LanguageProvider lang={this.state.language}>
        <Router>
          <div id="App" className={`layout ${this.state.colorTheme}`}>
            <Switch>
              <Route path="/" component={loginPage} exact/>
              <Route path="/home" component={opsListPage} />
              <Route path="/newOpening" component={newOpPage} />
              <Route path="/createVariation" component={CreateVariPage} />
              <Route path="/revise" component={RevisePage} />
              <Route path="/newVariation/:op_index" component={newVariPage} />
              <Route path="/openings/:op_index/:vari_index" component={variPage} />
              <Route path="/openings/:op_index" component={opPage} />
              <Route path="/training/:op_index" component={trainingPage} />
              <Route path="/" component={() => <p>Error 404! Page not found</p>} />
            </Switch>
          </div>
        </Router>
      </LanguageProvider>
    )
  }
}

export default App
