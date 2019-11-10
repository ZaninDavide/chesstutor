import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import OpeningPage from "./pages/OpeningPage"
import CreateVariPage from "./pages/CreateVariPage"
import RevisePage from "./pages/RevisePage"
import OpsListPage from "./pages/OpsListPage"
import VariationPage from "./pages/VariationPage"
import NewOpPage from "./pages/NewOpPage"
import LoginPage from "./pages/LoginPage"

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
        moves: [{ from: "d2", to: "d4", promotion: undefined, san: "d4", comment: "That's the first move, don't forget it."}] // , fen: "" 
      }
    ]
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


  updateDB(new_ops) {
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
      variations: []
    }
  }

  addOpening(op_object) {
    if (op_object.op_name !== undefined && op_object.op_color !== undefined) {
      /* Update state and database */
      const op_index = 0 // index of the new opening
      console.log(op_object)
      return op_index
    } else {
      console.log("addOpening: Can't add an opening without op_name or user_color")
      return false
    }
  }

  createOp(new_op_name, studyAs){
    return this.addOpening(this.newOpening(new_op_name, studyAs))
  }

  newVariation(vari_name = "Classic", vari_moves = []){
    // generates a new variation
    // WARN: it doesn't add it. To do that use addVariation
    return {
      vari_name: vari_name,
      vari_score: 0,
      moves: vari_moves
    }
  }

  addVariation(vari_object, op_index){
    if(vari_object.vari_name !== undefined){
      /* Update state and database */
      const vari_index = 0 // index of the new variation
      return vari_index
    }else {
      console.log("addVariation: Can't add an variation without its name")
      return false
    }
  }

  createVari(new_vari_name, vari_moves){
    return this.addVariation(this.newVariation(new_vari_name, vari_moves))
  }

  /* ---------------------------- RENDER ---------------------------- */
  render() {
    const opsListPage = ({ history }) => <OpsListPage ops={this.state.user_ops} history={history} updateDB={this.updateUserData}/>
    const opPage = ({ match, history }) => <OpeningPage ops={this.state.user_ops} history={history} match={match} />
    const variPage = ({ match, history }) => <VariationPage ops={this.state.user_ops} history={history} match={match} />
    const newOpPage = ({ match, history }) => <NewOpPage history={history} match={match} createOp={this.createOp}/>
    const loginPage = ({ match, history }) => <LoginPage history={history} match={match} setBearer={this.setBearer}/>

    return (
      <LanguageProvider lang={this.state.language}>
        <Router>
          <div id="App" className={`layout ${this.state.colorTheme}`}>
            <Switch>
              <Route path="/" component={loginPage} />
              <Route path="/home" exact component={opsListPage} />
              <Route path="/newOpening" component={newOpPage} />
              <Route path="/createVariation" component={CreateVariPage} />
              <Route path="/revise" component={RevisePage} />
              <Route path="/openings/:op_index/:vari_index" component={variPage} />
              <Route path="/openings/:op_index" component={opPage} />
              <Route path="/" component={() => <p>Error 404! Page not found</p>} />
            </Switch>
          </div>
        </Router>
      </LanguageProvider>
    )
  }
}

export default App
