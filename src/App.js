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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_data: {
        logged: false,
        name: "",
        _id: ""
      },
      user_ops: [
        {
          op_name: "London system",
          op_color: "white",
          variations: [
            {
              vari_name: "Classic",
              vari_score: 4,
              moves: [{ from: "d2", to: "d4", promotion: undefined, san: "d4", comment: "That's the first move, don't forget it."}] // , fen: "" 
            }
          ]
        }
      ],
      language: "eng",
      colorTheme: "defaultTheme"
    }
    this.createOp = this.createOp.bind(this)
    this.addOpening = this.addOpening.bind(this)
  }

  /* ----------------------------     FUNCTIONS     ---------------------------- */
  /* ---------------------------- DATABASE & SERVER ----------------------------*/
  updateDatabaseOps(new_ops) {
    if (new_ops.toString() !== this.state.user_ops.toString()) {
      console.log("updateDatabaseOps: database and state do not match. the database will be updated aniway")
    }
  }

  /* ---------------------------- OPENINGS ---------------------------- */
  newOpening(op_name = "New opening", op_color = "white") {
    // generates a new opening
    // WARN: it doesn't add it to user_ops. To do that use addOpening
    return {
      op_name: op_name,
      op_color: op_color,
      variations: [
        {
          var_name: "Classic",
          var_score: 4,
          moves: [{ from: "d2", to: "d4", san: "d4", comment: "That's the first move, don't forget it." }]
        }
      ]
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

  /* ---------------------------- RENDER ---------------------------- */
  render() {
    const opsListPage = ({ history }) => <OpsListPage ops={this.state.user_ops} history={history} />
    const opPage = ({ match, history }) => <OpeningPage ops={this.state.user_ops} history={history} match={match} />
    const variPage = ({ match, history }) => <VariationPage ops={this.state.user_ops} history={history} match={match} />
    const newOpPage = ({ match, history }) => <NewOpPage history={history} match={match} createOp={this.createOp}/>
    const loginPage = ({ match, history }) => <LoginPage history={history} match={match}/>

    return (
      <LanguageProvider lang={this.state.language}>
        <Router>
          <div id="App" className={`layout ${this.state.colorTheme}`}>
            <Switch>
              <Route path="/" exact component={opsListPage} />
              <Route path="/login" component={loginPage} />
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
