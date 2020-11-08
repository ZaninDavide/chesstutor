import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"

import OpeningPage from "./pages/OpeningPage"
// import CreateVariPage from "./pages/CreateVariPage"
import OpsListPage from "./pages/OpsListPage"
import VariationPage from "./pages/VariationPage"
import NewOpPage from "./pages/NewOpPage"
import LoginPage from "./pages/LoginPage"
import NewVariPage from "./pages/NewVariPage"
import TrainingPage from "./pages/TrainingPage"
import UserPage from "./pages/UserPage"
import ColorTrainingPage from "./pages/ColorTrainingPage"
import GroupTrainingPage from "./pages/GroupTrainingPage"
import AnalysisPage from "./pages/AnalysisPage"

import Notification from "./components/Notification"

import "./styles/App.css" // css by CLASSES + MAIN COMPONENTS
import "./styles/Elements.css" // css by ID + SECONDARY COMPONENTS
import "./styles/Modal.css"
import { LanguageProvider } from "./components/LanguageContext"

const SERVER_URI = "https://chesstutorserver.herokuapp.com" // "http://localhost:5000"

const defaultOps = []

class App extends Component {
  constructor(props) {
    super(props)

    // get saved username and bearer from local storage
    let saved_username = localStorage.getItem("username")
    let saved_bearer = localStorage.getItem("bearer")

    this.state = {
      _id: undefined,
      username: saved_username,
      bearer: saved_bearer,
      user_ops: [],
      language: "eng",
      loadingVisible: true,
      notification: { text: "Congrats", type: "important" },
      notification_visible: false,
      settings: { wait_time: 500, colorTheme: "darkTheme" }
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
    this.get_pc_move_data = this.get_pc_move_data.bind(this)
    this.get_correct_moves_data = this.get_correct_moves_data.bind(this)
    this.editComment = this.editComment.bind(this)
    this.getComment = this.getComment.bind(this)
    this.get_vari_next_move_data = this.get_vari_next_move_data.bind(this)
    this.serverRequest = this.serverRequest.bind(this)
    this.get_correct_moves_data_color = this.get_correct_moves_data_color.bind(this)
    this.get_pc_move_data_color = this.get_pc_move_data_color.bind(this)
    this.is_move_allowed_color = this.is_move_allowed_color.bind(this)
    this.setDrawBoardPDF = this.setDrawBoardPDF.bind(this)
    this.getDrawBoardPDF = this.getDrawBoardPDF.bind(this)
    this.setVariSubname = this.setVariSubname.bind(this)
    this.sendOpening = this.sendOpening.bind(this)
    this.deleteMail = this.deleteMail.bind(this)
    this.notify = this.notify.bind(this)
    this.setLanguage = this.setLanguage.bind(this)
    this.getOpFreeSubnames = this.getOpFreeSubnames.bind(this)
    this.setTheme = this.setTheme.bind(this)
    this.is_move_allowed_group = this.is_move_allowed_group.bind(this)
    this.get_pc_move_data_group = this.get_pc_move_data_group.bind(this)
    this.get_correct_moves_data_group = this.get_correct_moves_data_group.bind(this)
    this.setWaitTime = this.setWaitTime.bind(this)
    this.setSetting = this.setSetting.bind(this)
  }

  componentDidMount() {
    // REMEMBER ME
    if (this.state.username && this.state.bearer) {
      this.setBearer(this.state.bearer)
      // // // this.updateDB([]) // clear database of this user
    } else {
      this.setState({ loadingVisible: false }) // LOADING SCREEN NOW HIDDEN
    }
  }

  /* ----------------------------     FUNCTIONS     ---------------------------- */
  /* ---------------------------- DATABASE & SERVER ---------------------------- */

  async getUserData() {
    if (this.state.bearer) {
      let userData = await fetch(
        SERVER_URI + "/user",
        {
          headers: {
            Authorization: "Bearer " + this.state.bearer,
          },
        }
      ).then(res => res.json())

      this.setState(() => {
        let ops = userData.user_ops
        // console.log(ops)
        // NEW USER
        // if this is a new user give it the default openings 
        if (ops === undefined) {
          this.updateDB(defaultOps) // add them to the database
          ops = defaultOps
          console.log("You have recived the default datapack")
        }

        // fill missing data with defaults
        if (userData.language === undefined) {
          userData.language = "eng"
        }
        if (userData.settings === undefined) {
          userData.settings = { wait_time: 500, colorTheme: "darkTheme" }
        } else if (userData.settings.wait_time === undefined) {
          userData.settings.wait_time = 500
        } else if (userData.settings.wait_time === undefined) {
          userData.settings.colorTheme = "darkTheme"
        }

        return {
          user_ops: ops,
          _id: userData._id,
          username: userData.email,
          language: userData.language,
          settings: userData.settings,
          inbox: userData.inbox,
          loadingVisible: false, // LOADING SCREEN NOW HIDDEN
        }
      })
    } else {
      console.log("Log in before looking for user data")
    }
  }

  setBearer = async (bearer, redirectTo = "/") => {
    this.setState({ bearer, redirectTo })
    // localStorage.setItem("bearer", bearer)
    this.getUserData()
  }

  logout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("bearer")
    this.setState({ username: null, bearer: null, user_ops: [], _id: undefined })
  }

  updateUserData = (newUserData, bearer, refresh = true) => {
    fetch(SERVER_URI + "/user", {
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

  serverRequest(type, relative_url, body, bearer = this.state.bearer) {
    fetch(SERVER_URI + relative_url, {
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + bearer,
      },
      method: type,
    })
  }

  updateDB(new_ops = this.state.user_ops, language = "eng", settings = { wait_time: 500, colorTheme: "darkTheme" }) {
    /*if (new_ops.toString() !== this.state.user_ops.toString()) {
      // Warning you that you are saving in the database something that is different from what the user sees now
      console.log("updateDB: database and state won't match. the database will be updated aniway")
    }*/
    this.updateUserData({ user_ops: new_ops, language, settings }, this.state.bearer)
  }

  rememberMeLocally(username, bearer) {
    localStorage.setItem("username", username);
    localStorage.setItem("bearer", bearer);
  }

  sendOpening(to_user_names, op_index) {
    this.serverRequest("POST", "/sendOpening", { emails: to_user_names, op: this.state.user_ops[op_index] })
  }

  setLanguage(lang) {
    this.serverRequest("POST", "/setLanguage", { lang })
    this.setState({ language: lang })
  }

  setSetting(setting_name, setting_value) {
    this.serverRequest("POST", "/setSetting/" + setting_name.toString(), { setting_value })
    this.setState(old => {
      let setts = old.settings
      setts[setting_name] = setting_value
      return { setting: setts }
    })
  }

  setTheme(theme = "darkTheme") {
    // this.serverRequest("POST", "/setTheme", { theme })
    // this.setState({ colorTheme: theme })
    this.setSetting("colorTheme", theme)
  }

  setWaitTime(millis) {
    // this.serverRequest("POST", "/setWaitTime", { millis })
    // this.setState({ wait_time: millis })
    this.setSetting("wait_time", millis)
  }

  /* ---------------------------- NOTIFICATIONS ---------------------------- */

  notify(text, type = "normal", milliseconds = 3000) {
    this.setState({ notification: { text, type }, notification_visible: true })
    setTimeout(() => this.setState({ notification_visible: false }), milliseconds)
  }

  /* ---------------------------- OPENINGS ---------------------------- */

  newOpening(op_name = "New opening", op_color = "white", op_subname = undefined) {
    // generates a new opening
    // WARN: it doesn't add it to user_ops. To do that use addOpening
    return {
      op_name: op_name,
      op_subname: op_subname,
      op_color: op_color,
      variations: [],
      comments: {},
      pdfBoards: {},
      archived: false,
    }
  }

  addOpening(op_object) {
    if (op_object.op_name !== undefined && op_object.op_color !== undefined) {
      /* Update state and database */
      const op_index = this.state.user_ops.length // index of the new opening
      this.state.user_ops.push(op_object)

      this.serverRequest("POST", "/addOpening", op_object)
      return op_index
    } else {
      console.log("addOpening: Can't add an opening without op_name or user_color")
      return false
    }
  }

  createOp(new_op_name, studyAs, new_op_subname = undefined) {
    return this.addOpening(this.newOpening(new_op_name, studyAs, new_op_subname))
  }

  deleteOpening(op_index) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops.splice(op_index, 1)

      this.serverRequest("POST", "/deleteOpening/" + op_index)
      return { user_ops: new_user_ops }
    })
  }

  switchArchivedOpening(op_index) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].archived = !new_user_ops[op_index].archived

      this.serverRequest("POST", "/setOpeningArchived/" + op_index, { archived: new_user_ops[op_index].archived })
      return { user_ops: new_user_ops }
    })
  }

  renameOp(op_index, op_new_name) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].op_name = op_new_name

      this.serverRequest("POST", "/renameOpening/" + op_index, { new_name: op_new_name })
      return { user_ops: new_user_ops }
    })
  }

  deleteMail(mail_index) {
    this.setState(old => {
      let new_inbox = old.inbox
      new_inbox.splice(mail_index, 1)

      this.serverRequest("POST", "/deleteMail/" + mail_index)
      return { inbox: new_inbox }
    })
  }

  /* ---------------------------- VARIATIONS ---------------------------- */

  newVariation(vari_name = "Classic", vari_moves = [], vari_subname = undefined) {
    // generates a new variation (returns a vari_object)
    // WARN: it doesn't add it. To do that use addVariation
    return {
      vari_name: vari_name,
      vari_score: 0,
      moves: vari_moves,
      archived: false,
      vari_subname: vari_subname,
    }
  }

  addVariation(vari_object, op_index) {
    if (vari_object.vari_name !== undefined) {
      /* Update state and database */
      const vari_index = this.state.user_ops[op_index].variations.length // index of the new variation
      this.state.user_ops[op_index].variations.push(vari_object)

      this.serverRequest("POST", "/addVariation/" + op_index, vari_object)
      return vari_index
    } else {
      console.log("addVariation: Can't add an variation without its name")
      return false
    }
  }

  createVari(new_vari_name, vari_moves, op_index, new_vari_subname) {
    return this.addVariation(this.newVariation(new_vari_name, vari_moves, new_vari_subname), op_index)
  }

  switchVariArchived(op_index, vari_index) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations[vari_index].archived = !new_user_ops[op_index].variations[vari_index].archived

      this.serverRequest(
        "POST",
        "/setVariationArchived/" + op_index + "/" + vari_index,
        { archived: new_user_ops[op_index].variations[vari_index].archived }
      )
      return { user_ops: new_user_ops }
    })
  }

  renameVari(op_index, vari_index, vari_new_name) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations[vari_index].vari_name = vari_new_name

      this.serverRequest("POST", "/renameVariation/" + op_index + "/" + vari_index, { new_name: vari_new_name })
      return { user_ops: new_user_ops }
    })
  }

  deleteVari(op_index, vari_index) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations.splice(vari_index, 1)

      this.serverRequest("POST", "/deleteVariation/" + op_index + "/" + vari_index)
      return { user_ops: new_user_ops }
    })
  }

  setVariSubname(op_index, vari_index, vari_new_subname) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations[vari_index].vari_subname = vari_new_subname

      this.serverRequest("POST", "/setVariationSubname/" + op_index + "/" + vari_index, { new_subname: vari_new_subname })
      return { user_ops: new_user_ops }
    })
  }

  getOpFreeSubnames(op_index, new_vari_name, allSubNames) {
    return allSubNames.filter(subname => this.state.user_ops[op_index].variations.filter(v => v.vari_name === new_vari_name && v.vari_subname === subname).length === 0)
  }

  /* ---------------------------- COMMENTS ---------------------------- */

  editComment(op_index, json_moves, text) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      let str = "|"
      json_moves.forEach(elem => {
        str += elem.san + "|"
      });
      new_user_ops[op_index].comments[str] = text

      this.serverRequest("POST", "/editComment/" + op_index + "/" + str, { text })
      return { user_ops: new_user_ops }
    })
  }

  getComment(op_index, json_moves) {
    let str = "|"
    json_moves.forEach(elem => {
      str += elem.san + "|"
    });
    return this.state.user_ops[op_index].comments[str]
  }

  /* ---------------------------- PDF ---------------------------- */

  setDrawBoardPDF(op_index, json_moves, bool) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      let str = "|"
      json_moves.forEach(elem => {
        str += elem.san + "|"
      });
      new_user_ops[op_index].pdfBoards[str] = bool

      let value = new_user_ops[op_index].pdfBoards[str]
      this.serverRequest("POST", "/setDrawBoardPDF/" + op_index + "/" + str, { value })
      return { user_ops: new_user_ops }
    })
  }

  getDrawBoardPDF(op_index, json_moves) {
    let str = "|"
    json_moves.forEach(elem => {
      str += elem.san + "|"
    });
    return this.state.user_ops[op_index].pdfBoards[str]
  }

  /* --------------------------- TRAINING --------------------------- */

  is_move_allowed(op_index, json_moves, move_data, vari_index = undefined) {
    let is_allowed = false
    let finished_training = true
    let op = this.state.user_ops[op_index]
    if (vari_index === undefined) {
      // look into all variations(not archived)
      for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
        // loop through all variations 
        let vari = op.variations[vari_index]
        if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enougth and not archived
          let first_moves = vari.moves.slice(0, json_moves.length)

          // is the variation compatible with the already done moves?
          if (JSON.stringify(first_moves) === JSON.stringify(json_moves)) {
            finished_training = false // there is at least one move to do
            let vari_next_move = vari.moves[json_moves.length] // take the next move

            // is it the move I'm going to do?
            if (vari_next_move.from === move_data.from && vari_next_move.to === move_data.to && vari_next_move.promotion === move_data.promotion) {
              is_allowed = true
              break;
            }
          }

        }
      }
    } else {
      // look only into this variation
      let vari_next_move = this.get_vari_next_move_data(op_index, vari_index, json_moves)
      if (vari_next_move !== null) {
        finished_training = false
        if (vari_next_move.from === move_data.from && vari_next_move.to === move_data.to && vari_next_move.promotion === move_data.promotion) {
          is_allowed = true
        }
      }
    }
    if (finished_training) {
      this.notify("Congrats! Training finished", "important")
      return false
    }
    return is_allowed
  }

  is_move_allowed_color(color, json_moves, move_data) {
    let is_allowed = false
    let finished_training = true

    for (let op_index = 0; op_index < this.state.user_ops.length; op_index++) {
      let op = this.state.user_ops[op_index]

      if (op.op_color === color && !op.archived) {
        // look into all variations(not archived)
        for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
          // loop through all variations 
          let vari = op.variations[vari_index]

          if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enougth and not archived
            let first_moves = vari.moves.slice(0, json_moves.length)
            // is the variation compatible with the already done moves?
            if (JSON.stringify(first_moves) === JSON.stringify(json_moves)) {
              finished_training = false // there is at least one move to do
              let vari_next_move = vari.moves[json_moves.length] // take the next move

              // is it the move I'm going to do?
              if (vari_next_move.from === move_data.from && vari_next_move.to === move_data.to && vari_next_move.promotion === move_data.promotion) {
                is_allowed = true
                break;
              }
            }

          }
        }
      }
      if (is_allowed) {
        break;
      }
    }
    if (finished_training) {
      this.notify("Congrats! Training finished", "important")
      return false
    }
    return is_allowed
  }


  is_move_allowed_group(op_index, json_moves, move_data, vari_name = undefined) {
    let is_allowed = false
    let finished_training = true
    let op = this.state.user_ops[op_index]

    // look into all variations(not archived) with the name vari_name
    for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
      // loop through all variations 
      let vari = op.variations[vari_index]
      if (vari.vari_name = vari_name) {
        if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enougth and not archived
          let first_moves = vari.moves.slice(0, json_moves.length)

          // is the variation compatible with the already done moves?
          if (JSON.stringify(first_moves) === JSON.stringify(json_moves)) {
            finished_training = false // there is at least one move to do
            let vari_next_move = vari.moves[json_moves.length] // take the next move

            // is it the move I'm going to do?
            if (vari_next_move.from === move_data.from && vari_next_move.to === move_data.to && vari_next_move.promotion === move_data.promotion) {
              is_allowed = true
              break;
            }
          }

        }
      }
    }

    if (finished_training) {
      this.notify("Congrats! Training finished", "important")
      return false
    }
    return is_allowed
  }

  get_correct_moves_data(op_index, json_moves, vari_index = undefined) {
    if (vari_index !== undefined) {
      let correct_move = this.get_vari_next_move_data(op_index, vari_index, json_moves)
      return correct_move === null ? [] : [correct_move]
    }

    let correct_moves = []
    let op = this.state.user_ops[op_index]
    for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
      // loop through all variations 
      let vari = op.variations[vari_index]
      if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enougth and not archived
        let first_moves = vari.moves.slice(0, json_moves.length)

        // is the variation compatible with the already done moves?
        if (JSON.stringify(first_moves) === JSON.stringify(json_moves)) {
          let vari_next_move = vari.moves[json_moves.length] // take the next move
          correct_moves.push(vari_next_move) // add the move to the list
        }

      }
    }
    return correct_moves
  }

  get_correct_moves_data_color(color, json_moves) {
    let correct_moves = []
    for (let op_index = 0; op_index < this.state.user_ops.length; op_index++) {
      let op = this.state.user_ops[op_index]
      if (op.op_color === color && !op.archived) {
        for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
          // loop through all variations 
          let vari = op.variations[vari_index]
          if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enougth and not archived
            let first_moves = vari.moves.slice(0, json_moves.length)

            // is the variation compatible with the already done moves?
            if (JSON.stringify(first_moves) === JSON.stringify(json_moves)) {
              let vari_next_move = vari.moves[json_moves.length] // take the next move
              correct_moves.push(vari_next_move) // add the move to the list
            }

          }
        }
      }
    }
    return correct_moves
  }

  get_correct_moves_data_group(op_index, json_moves, vari_name = undefined) {
    let correct_moves = []
    let op = this.state.user_ops[op_index]
    for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
      // loop through all variations 
      let vari = op.variations[vari_index]
      console.log(vari.vari_name, vari_name)
      if (vari.vari_name === vari_name) {
        if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enougth and not archived
          let first_moves = vari.moves.slice(0, json_moves.length)

          // is the variation compatible with the already done moves?
          if (JSON.stringify(first_moves) === JSON.stringify(json_moves)) {
            let vari_next_move = vari.moves[json_moves.length] // take the next move
            correct_moves.push(vari_next_move) // add the move to the list
          }

        }
      }
    }
    return correct_moves
  }

  get_pc_move_data(op_index, json_moves, vari_index = undefined) {
    if (vari_index !== undefined) {
      let vari_next_move = this.get_vari_next_move_data(op_index, vari_index, json_moves)
      return vari_next_move
    }
    let correct_moves = this.get_correct_moves_data(op_index, json_moves)
    // return false if there is no correct move
    if (correct_moves.length === 0) return null
    // choose which move to do
    let random = Math.round(Math.random() * (correct_moves.length - 1));
    return correct_moves[random]
  }

  get_pc_move_data_color(color, json_moves) {
    let correct_moves = this.get_correct_moves_data_color(color, json_moves)

    // return false if there is no correct move
    if (correct_moves.length === 0) return null
    // choose which move to do
    let random = Math.round(Math.random() * (correct_moves.length - 1));
    return correct_moves[random]
  }

  get_pc_move_data_group(op_index, json_moves, vari_name = undefined) {
    let correct_moves = this.get_correct_moves_data_group(op_index, json_moves, vari_name)

    // return false if there is no correct move
    if (correct_moves.length === 0) return null
    // choose which move to do
    let random = Math.round(Math.random() * (correct_moves.length - 1));
    return correct_moves[random]
  }

  get_vari_next_move_data(op_index, vari_index, json_moves) {
    let op = this.state.user_ops[op_index]
    let vari = op.variations[vari_index]

    if (vari.moves.length <= json_moves.length) return null // this variation is NOT long enougth

    let vari_next_move = vari.moves[json_moves.length] // take the next move
    return vari_next_move
  }

  /* ---------------------------- RENDER ---------------------------- */
  render() {
    const opsListPage = ({ history }) => <OpsListPage
      ops={this.state.user_ops}
      history={history}
      deleteOpening={this.deleteOpening}
      renameOp={this.renameOp}
      sendOpening={this.sendOpening}
      switchArchivedOpening={this.switchArchivedOpening}
      username={this.state.username}
    />
    const opPage = ({ match, history }) => <OpeningPage
      ops={this.state.user_ops}
      history={history}
      match={match}
      switchVariArchived={this.switchVariArchived}
      renameVari={this.renameVari}
      setVariSubname={this.setVariSubname}
      deleteVari={this.deleteVari}
    />
    const trainingPage = ({ match, history }) => <TrainingPage
      history={history}
      match={match}
      ops={this.state.user_ops}
      is_move_allowed={this.is_move_allowed}
      get_pc_move_data={this.get_pc_move_data}
      getComment={this.getComment}
      editComment={this.editComment}
      setDrawBoardPDF={this.setDrawBoardPDF}
      getDrawBoardPDF={this.getDrawBoardPDF}
      get_correct_moves_data={this.get_correct_moves_data}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
    />
    const newVariPage = ({ match, history }) => <NewVariPage
      ops={this.state.user_ops}
      history={history}
      match={match}
      createVari={this.createVari}
      getComment={this.getComment}
      editComment={this.editComment}
      setDrawBoardPDF={this.setDrawBoardPDF}
      getDrawBoardPDF={this.getDrawBoardPDF}
      get_correct_moves_data={this.get_correct_moves_data}
      getOpFreeSubnames={this.getOpFreeSubnames}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
    />
    const variPage = ({ match, history }) => <VariationPage
      ops={this.state.user_ops}
      history={history}
      match={match}
      createVari={this.createVari}
      getComment={this.getComment}
      editComment={this.editComment}
      setDrawBoardPDF={this.setDrawBoardPDF}
      getDrawBoardPDF={this.getDrawBoardPDF}
      get_vari_next_move_data={this.get_vari_next_move_data}
      get_pc_move_data={this.get_pc_move_data}
      is_move_allowed={this.is_move_allowed}
      get_correct_moves_data={this.get_correct_moves_data}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
    />
    const newOpPage = ({ match, history }) => <NewOpPage history={history} match={match} createOp={this.createOp} />
    const loginPage = ({ match, history }) => <LoginPage
      history={history}
      match={match}
      setBearer={this.setBearer}
      username={this.state.username}
      rememberMeLocally={this.rememberMeLocally}
      notify={this.notify}
      showLoadingScreen={() => this.setState({ loadingVisible: true })}
    />
    const userPage = ({ match, history }) => <UserPage
      history={history}
      match={match}
      logout={this.logout}
      username={this.state.username}
      inbox={this.state.inbox}
      addOpening={this.addOpening}
      deleteMail={this.deleteMail}
      notify={this.notify}
      setLanguage={this.setLanguage}
      language={this.state.language}
      setTheme={this.setTheme}
      colorTheme={this.state.settings.colorTheme}
      wait_time={this.state.settings.wait_time}
      setWaitTime={this.setWaitTime}
    />
    const colorTrainingPage = ({ match, history }) => <ColorTrainingPage
      history={history}
      match={match}
      ops={this.state.user_ops}
      is_move_allowed_color={this.is_move_allowed_color}
      get_pc_move_data_color={this.get_pc_move_data_color}
      get_correct_moves_data_color={this.get_correct_moves_data_color}
      getComment={this.getComment}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
    />
    const variTrainingPage = ({ match, history }) => <GroupTrainingPage
      history={history}
      match={match}
      ops={this.state.user_ops}
      is_move_allowed_group={this.is_move_allowed_group}
      get_pc_move_data_group={this.get_pc_move_data_group}
      get_correct_moves_data_group={this.get_correct_moves_data_group}
      getComment={this.getComment}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
    />
    const analysisPage = ({ match, history }) => <AnalysisPage
      history={history}
      match={match}
      wait_time={this.state.settings.wait_time}
    />
    const redirectToLogin = () => <Redirect to="/login" />
    const redirectToHome = () => <Redirect to="/" />
    let needLogin = (!this.state.username && !this.state.loadingVisible)

    let noOpenings = this.state.user_ops.length === 0

    return (
      <LanguageProvider lang={this.state.language}>
        <Router>
          <div id="App" className={`layout ${this.state.settings.colorTheme}`}>
            <div id="loadingScreen" style={{ display: this.state.loadingVisible ? "table" : "none" }}>
              <span id="loadingScreenBottom">&nbsp;{"Loading your data... Please wait."}</span>
            </div>
            <Notification
              visible={this.state.notification_visible}
              text={this.state.notification.text}
              type={this.state.notification.type}
              close={() => this.setState({ notification_visible: false })}
            ></Notification>
            <Switch>
              <Route path="/" render={needLogin ? redirectToLogin : opsListPage} exact />
              <Route path="/login" render={!needLogin ? redirectToHome : loginPage} exact />
              <Route path="/profile" render={needLogin ? redirectToLogin : userPage} exact />
              <Route path="/newOpening" render={newOpPage} />
              <Route path="/openings/training/:op_index/:vari_name" render={noOpenings ? redirectToHome : variTrainingPage} />
              <Route path="/newVariation/:op_index/:vari_name" render={newVariPage} />
              <Route path="/openings/:op_index/:vari_index" render={noOpenings ? redirectToHome : variPage} />
              <Route path="/openings/:op_index" render={/*noOpenings ? redirectToHome : */opPage} />
              <Route path="/training/fullcolor/:color_number" render={noOpenings ? redirectToHome : colorTrainingPage} />
              <Route path="/training/:op_index" render={noOpenings ? redirectToHome : trainingPage} />
              <Route path="/analysis/:color/:moves" render={analysisPage} />
              <Route path="/" render={() => <p>Error 404! Page not found</p>} />
            </Switch>
          </div>
        </Router>
      </LanguageProvider>
    )
  }
}

export default App
