import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"

import OpeningPage from "./pages/OpeningPage"
import OpsListPage from "./pages/OpsListPage"
import VariationPage from "./pages/VariationPage"
import NewOpPage from "./pages/NewOpPage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import NewVariPage from "./pages/NewVariPage"
import TrainingPage from "./pages/TrainingPage"
import UserPage from "./pages/UserPage"
import MailPage from "./pages/MailPage"
import ColorTrainingPage from "./pages/ColorTrainingPage"
import GroupTrainingPage from "./pages/GroupTrainingPage"
import AnalysisPage from "./pages/AnalysisPage"
import SmartTrainingPage from "./pages/SmartTrainingPage"
import ExtraTrainingPage from "./pages/ExtraTrainingPage"

import Notification from "./components/Notification"

import "./styles/App.css" // css by CLASSES + MAIN COMPONENTS
import "./styles/Elements.css" // css by ID + SECONDARY COMPONENTS
import "./styles/Modal.css"
import "./styles/Print.css" // css by CLASSES + MAIN COMPONENTS
import { LanguageProvider } from "./components/LanguageContext"
import { shuffle } from "./utilities/shuffle"

import dayjs from "dayjs"
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)


const SERVER_URI = "https://chesstutorserver.herokuapp.com" // "http://localhost:5000"

const defaultOps = []

const seed = Math.round(100000*Math.random())

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
      settings: { wait_time: 500, colorTheme: "autoTheme", volume: 0.6 }
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
    this.get_correct_moves_data_book = this.get_correct_moves_data_book.bind(this)
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
    this.renameVariGroup = this.renameVariGroup.bind(this)
    this.deleteVariGroup = this.deleteVariGroup.bind(this)
    this.updateInbox = this.updateInbox.bind(this)
    this.setVisualChessNotation = this.setVisualChessNotation.bind(this)
    this.get_compatible_variations = this.get_compatible_variations.bind(this)
    this.updateVariScore = this.updateVariScore.bind(this)
    this.get_smart_training_targets = this.get_smart_training_targets.bind(this)
    this.smart_training_get_target_vari = this.smart_training_get_target_vari.bind(this)
    this.smartTrainingVariFinished = this.smartTrainingVariFinished.bind(this)
    this.onSmartTrainingVariFinished = this.onSmartTrainingVariFinished.bind(this)
    this.play_training_finished_sound = this.play_training_finished_sound.bind(this)
    this.downloadDatabase = this.downloadDatabase.bind(this)
    this.addMultipleVaris = this.addMultipleVaris.bind(this)
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
          userData.settings = { wait_time: 500, colorTheme: "autoTheme", volume: 0.6, visual_chess_notation: true }
        } else {
          if (userData.settings.wait_time === undefined) userData.settings.wait_time = 500
          if (userData.settings.colorTheme === undefined) userData.settings.colorTheme = "autoTheme"
          if (userData.settings.volume === undefined) userData.settings.volume = 0.6 /* from 0 to 1 */
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

  updateDB(new_ops = this.state.user_ops, language = "eng", settings = { wait_time: 500, colorTheme: "darkTheme", volume: 0.5 }, inbox = []) {
    /*if (new_ops.toString() !== this.state.user_ops.toString()) {
      // Warning you that you are saving in the database something that is different from what the user sees now
      console.log("updateDB: database and state won't match. the database will be updated aniway")
    }*/
    this.updateUserData({ user_ops: new_ops, language, settings, inbox}, this.state.bearer)
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

  setVisualChessNotation(visual){
    this.setSetting("visual_chess_notation", visual)
  }

  async updateInbox(){
    if (this.state.bearer) {
      let data = await fetch(
        SERVER_URI + "/inbox",
        {
          headers: {
            Authorization: "Bearer " + this.state.bearer,
          },
        }
      ).then(res => res.json())

      this.setState({inbox: data.inbox ? data.inbox : []})
    } else {
      console.log("Log in before looking for the user's inbox")
    }
  }

  downloadDatabase() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(this.state.user_ops)
    ));
    element.setAttribute('download', this.state.username + "_data.json");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /* ---------------------------- NOTIFICATIONS ---------------------------- */

  notify(text, type = "normal", milliseconds = 3000) {
    this.setState({ notification: { text, type }, notification_visible: true })
    setTimeout(() => this.setState({ notification_visible: false }), milliseconds)
  }

  play_training_finished_sound() {
    let audio = new Audio("/files/sound_training_finished.mp3")
    audio.volume = this.state.settings.volume || 0.6
    audio.play()
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
      this.setState(old => {
        return {
          user_ops: [...old.user_ops, JSON.parse(JSON.stringify(op_object))]
        }
      })

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
      this.setState(old => {
        let new_ops = old.user_ops
        new_ops[op_index].variations.push(JSON.parse(JSON.stringify(vari_object)))
        return {
          user_ops: new_ops
        }
      })

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

  getOpFreeSubnames(how_many, op_index, new_vari_name, ok_empty_subname = false) {
    let varis = this.state.user_ops[op_index].variations.filter(v => v.vari_name === new_vari_name)
    
    let free_subnames = []
    
    if(ok_empty_subname && varis.filter(v => v.vari_subname === undefined).length === 0){
      // if the empty subname is free add it
      free_subnames.push(undefined)
    }

    let number = 1
    let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    while(free_subnames.length < how_many) {
      let number_str = number == 1 ? "" : number.toString()
      for(let l of letters) {
        let subn = l + number_str;
        if(varis.filter(v => v.vari_subname == subn).length === 0){
          // if this subname is free add it
          free_subnames.push(subn)
          if(free_subnames.length >= how_many) break;
        }
      }
      number += 1;
    }

    return free_subnames;
  }

  addMultipleVaris(op_index, vari_name, varis){
    // it would be better to explore the tree to avoid redoing the same moves
    let allowed_subnames = this.getOpFreeSubnames(varis.length, op_index, vari_name, false)
    console.log(varis);
    varis.forEach((v, i) => {        
        this.createVari(vari_name, v, op_index, allowed_subnames[i])
    })
  }

  renameVariGroup(op_index, vari_group_name, vari_group_new_name) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations.forEach(c => {
        if(c.vari_name === vari_group_name) c.vari_name = vari_group_new_name
      })

      this.serverRequest("POST", "/renameVariationGroup", { op_index, vari_group_name, vari_group_new_name })
      return { user_ops: new_user_ops }
    })
  }
  
  deleteVariGroup(op_index, vari_group_name) {
    this.setState(old => {
      let new_user_ops = old.user_ops
      new_user_ops[op_index].variations = new_user_ops[op_index].variations.filter(c => c.vari_name !== vari_group_name)

      this.serverRequest("POST", "/deleteVariationGroup", { op_index, vari_group_name })
      return { user_ops: new_user_ops }
    })
  }

  updateVariScore(op_index, vari_index, number_of_errors, factor, schedule, must_repeat, callback) {
    // randomize schedule with 10% variability
    const jitter = 1 + (Math.random() * 2 - 1) * 0.1
    schedule = Math.round(schedule * jitter)
    
    const vari_new_score = {
      factor: factor,
      schedule: schedule,
      must_repeat: must_repeat,
      next_date: dayjs().add(schedule, "days").toDate(), // local time
      total_errors: 0,
      total_trainings: 0, 
    }

    this.setState(old => {
      let new_user_ops = old.user_ops

      const err = new_user_ops[op_index].variations[vari_index].vari_score ? new_user_ops[op_index].variations[vari_index].vari_score.total_errors : 0
      const tra = new_user_ops[op_index].variations[vari_index].vari_score ? new_user_ops[op_index].variations[vari_index].vari_score.total_trainings : 0      
      vari_new_score.total_errors = err + number_of_errors
      vari_new_score.total_trainings = tra + 1

      new_user_ops[op_index].variations[vari_index].vari_score = vari_new_score

      this.serverRequest("POST", "/setVariationScore/" + op_index + "/" + vari_index, { new_vari_score: vari_new_score })
      return { user_ops: new_user_ops }
    }, callback)
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
    if(!this.state.user_ops[op_index]) return ""
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
        if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enough and not archived
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

          if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enough and not archived
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
      if (vari.vari_name === vari_name) {
        if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enough and not archived
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
      if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enough and not archived
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
      if ((op.op_color === color || color === "both") && !op.archived) {
        for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
          // loop through all variations 
          let vari = op.variations[vari_index]
          if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enough and not archived
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
      // console.log(vari.vari_name, vari_name)
      if (vari.vari_name === vari_name) {
        if (vari.moves.length > json_moves.length && !vari.archived) { // this variation is long enough and not archived
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

    if (vari.moves.length <= json_moves.length) return null // this variation is NOT long enough

    let vari_next_move = vari.moves[json_moves.length] // take the next move
    return vari_next_move
  }

  get_correct_moves_data_book(json_moves, opQuery = undefined, variQuery = undefined, subnameQuery = undefined) {
    // opQuery: null=all true=white false=black number=op_index
    // variQuery: null=all string=vari_name
    // subnameQuery: null=all string=vari_subname
    let correct_moves = []
    for (let op_index = 0; op_index < this.state.user_ops.length; op_index++) {
      let op = this.state.user_ops[op_index]

      let query_good = true
      if(
        (opQuery === true && op.op_color === "black") || // query white but op black
        (opQuery === false && op.op_color === "white") // query black but op white
      ){ 
        query_good = false
      }
      // name doesn't match with query which is not black or white or null
      if(opQuery !== undefined && opQuery !== null && opQuery !== true && opQuery !== false && opQuery !== op_index){
        query_good = false
      }

      if (!op.archived && query_good) {
        for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
          // loop through all variations 
          let vari = op.variations[vari_index] 
          
          query_good = true
          // name doesn't match with query
          if(variQuery !== undefined && variQuery !== null && variQuery !== vari.vari_name) 
            query_good = false 
          
          // subname doesn't match with query
          if(!(subnameQuery === "" && vari.vari_subname === undefined) && subnameQuery !== undefined && subnameQuery !== null && subnameQuery !== undefined && subnameQuery !== null && subnameQuery !== vari.vari_subname) 
            query_good = false 

          if (vari.moves.length > json_moves.length && !vari.archived && query_good) { // this variation is long enough and not archived
            let first_moves = vari.moves.slice(0, json_moves.length)

            // is the variation compatible with the already done moves?
            if (JSON.stringify(first_moves) === JSON.stringify(json_moves)) {
              let vari_next_move = JSON.parse(JSON.stringify(vari.moves[json_moves.length])) // take the next move
              vari_next_move.op_name = op.op_name;
              vari_next_move.vari_name = vari.vari_name;
              vari_next_move.vari_subname = vari.vari_subname;
              
              // vari_next_move.comment = this.getComment(op_index, [...json_moves, vari_next_move]);

              correct_moves.push(vari_next_move) // add the move to the list
            }

          }
        }
      }
    }
    return correct_moves
  }

  get_compatible_variations(json_moves, opQuery = undefined, variQuery = undefined, subnameQuery = undefined) {
    // opQuery: null=all true=white false=black number=op_index
    // variQuery: null=all string=vari_name
    // subnameQuery: null=all string=vari_subname
    let compatible_varis = []
    for (let op_index = 0; op_index < this.state.user_ops.length; op_index++) {
      let op = this.state.user_ops[op_index]

      let query_good = true
      if(
        (opQuery === true && op.op_color === "black") || // query white but op black
        (opQuery === false && op.op_color === "white") // query black but op white
      ){ 
        query_good = false
      }
      // name doesn't match with query which is not black or white or null
      if(opQuery !== undefined && opQuery !== null && opQuery !== true && opQuery !== false && opQuery !== op_index){
        query_good = false
      }

      if (!op.archived && query_good) {
        for (let vari_index = 0; vari_index < op.variations.length; vari_index++) {
          // loop through all variations 
          let vari = op.variations[vari_index] 
          
          query_good = true
          // name doesn't match with query
          if(variQuery !== undefined && variQuery !== null && variQuery !== vari.vari_name) 
            query_good = false 
          
          // subname doesn't match with query
          if(!(subnameQuery === "" && vari.vari_subname === undefined) && subnameQuery !== undefined && subnameQuery !== null && subnameQuery !== undefined && subnameQuery !== null && subnameQuery !== vari.vari_subname) 
            query_good = false 

          if (vari.moves.length >= json_moves.length && !vari.archived && query_good) { // this variation is long enough and not archived
            let first_moves = vari.moves.slice(0, json_moves.length)

            // is the variation compatible with the already done moves?
            if (JSON.stringify(first_moves) === JSON.stringify(json_moves)) {
              // add the variation to the list
              compatible_varis.push({
                op_index: op_index,
                op_name: op.op_name,
                vari_name: vari.vari_name,
                vari_subname: vari.vari_subname,
              })
            }

          }
        }
      }
    }
    return compatible_varis
  }

  /* ---------------------------- SMART TRAINIG ---------------------------- */

  get_smart_training_targets(user_ops = this.state.user_ops) {
    // calculate the targets_list
    if(user_ops){
      let start_targets_list = []

      shuffle(user_ops.map((v,i) => {v.op_index = i; return v}), seed).forEach((op) => {
        if(op.archived) return;

        shuffle(op.variations.map((c,j) => {c.vari_index=j; return c}), seed).forEach((vari) => {
          // decide if this variation needs to be studied
          let ok = false

          if(vari.vari_score){
            // this vari is must_repeat
            if(vari.vari_score.must_repeat) ok = true

            // is time for this variation to be studied?
            const next_date = dayjs(vari.vari_score.next_date).hour(0).minute(0).second(0).millisecond(0)
            const today = dayjs().hour(0).minute(0).second(0).millisecond(0)
            const days_diff = dayjs.duration(today.diff(next_date)).asDays()
            if(days_diff >= 0) ok = true
          }else{
            ok = true
          }

          if(ok) start_targets_list.push({
            vari_color: op.op_color,
            vari_op_index: op.op_index,
            vari_index: vari.vari_index,
          })
        })
      })

      // you don't need to train now
      if(start_targets_list.length === 0) {
        // this.notify("You don't need to train any more for today.", "important")
        return []
      }else{
        // this.notify("You have " + start_targets_list.length + " variations to train on for today.", "important")
      }
      return start_targets_list
    }else{
      return []
    }
  }

  errors_to_quality(first_error, n_errors, line_length) {
    if (n_errors === 0) return 5

    const normalized = 6 * (n_errors / line_length) + (line_length / first_error) * 0.8

    const quality = {
      1: 4, 2: 3, 3: 2, 4: 1 // the others are 0
    }
    return quality[Math.round(normalized)] || 0
  }

  get_new_vari_score(quality, lastSchedule, lastFactor) {
    let newFac
    let curSchedule

    if (quality == null || quality < 0 || quality > 5) {
        quality = 0
    }

    let calcFactor = function(oldFac, quality) {
      return oldFac + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    }

    if (lastSchedule === 1) {
        curSchedule = 6
        newFac = 2.5
    } else if (lastSchedule == null) {
        curSchedule = 1
        newFac = 2.5
    } else {
        if (quality < 3) {
            newFac = lastFactor
            curSchedule = lastSchedule
        } else {
            newFac = calcFactor(lastFactor, quality)

            if (newFac < 1.3) {
                newFac = 1.3
            }

            curSchedule = Math.round(lastSchedule * newFac)
        }
    }

    return {
        factor: newFac,
        schedule: curSchedule,
        must_repeat: quality <= 3,
    }
  }

  smart_training_get_target_vari(targets_list) {
    const target_vari_color = targets_list.length > 0 ? targets_list[0].vari_color : "none"
    const target_vari_op_index = targets_list.length > 0 ? targets_list[0].vari_op_index : null
    const target_vari_index = targets_list.length > 0 ? targets_list[0].vari_index : null

    let smart_training_target_vari = null;
    if(
      target_vari_color !== null &&
      target_vari_color !== "none" &&
      target_vari_op_index !== null &&
      target_vari_index !== null &&
      this.state.user_ops && 
      this.state.user_ops.length > target_vari_op_index &&
      this.state.user_ops[target_vari_op_index].variations.length > target_vari_index
    ){
      smart_training_target_vari = this.state.user_ops[target_vari_op_index].variations[target_vari_index]
    }
    return smart_training_target_vari
  }

  smartTrainingVariFinished(targets_list, first_error, number_of_errors, callback) {
    const target_vari = this.smart_training_get_target_vari(targets_list)
    const target_vari_op_index = targets_list.length > 0 ? targets_list[0].vari_op_index : null
    const target_vari_index = targets_list.length > 0 ? targets_list[0].vari_index : null

    if(target_vari){
      const new_vari_score = this.get_new_vari_score(
        this.errors_to_quality(first_error, number_of_errors, target_vari.moves.length),
        target_vari.vari_score ? target_vari.vari_score.schedule : null,
        target_vari.vari_score ? target_vari.vari_score.factor : null
      )
  
      this.updateVariScore(
        target_vari_op_index, 
        target_vari_index,
        number_of_errors,
        new_vari_score.factor,
        new_vari_score.schedule,
        new_vari_score.must_repeat,
        callback
      )
    }

  }

  onSmartTrainingVariFinished(targets_list, first_error, number_of_errors, resetBoard_callback) {
    // save this training
    this.smartTrainingVariFinished(targets_list, first_error, number_of_errors, () => {
      if(targets_list.length <= 1) {
        // TODO: BIGGER CONGRATS + SEND THE USER TO THE HOME PAGE
        this.notify("You don't need to train any more for today.", "important")
        this.play_training_finished_sound()
        return false
      }else{
        setTimeout(resetBoard_callback, 500) // TODO: you can try to move even if you have finished
      }
    })
  }

  /* ---------------------------- RENDER ---------------------------- */
  render() {
    let targets_list = this.get_smart_training_targets()

    // console.log(this.state.user_ops)

    const opsListPage = ({ history }) => <OpsListPage
      ops={this.state.user_ops}
      history={history}
      deleteOpening={this.deleteOpening}
      renameOp={this.renameOp}
      sendOpening={this.sendOpening}
      switchArchivedOpening={this.switchArchivedOpening}
      username={this.state.username}
      targets_list={targets_list}
    />
    const opPage = ({ match, history }) => <OpeningPage
      ops={this.state.user_ops}
      history={history}
      match={match}
      switchVariArchived={this.switchVariArchived}
      renameVari={this.renameVari}
      setVariSubname={this.setVariSubname}
      deleteVari={this.deleteVari}
      renameVariGroup={this.renameVariGroup}
      deleteVariGroup={this.deleteVariGroup}
      getOpColor={(op_index) => {
        if(this.state.user_ops[op_index]) return this.state.user_ops[op_index].op_color
      }}
      getOpFreeSubnames={this.getOpFreeSubnames}
      addMultipleVaris={this.addMultipleVaris}
      notify={this.notify}
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
      get_compatible_variations={this.get_compatible_variations}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
      volume={this.state.settings.volume}
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
      get_correct_moves_data_group={this.get_correct_moves_data_group}
      get_correct_moves_data_book={this.get_correct_moves_data_book}
      getOpFreeSubnames={this.getOpFreeSubnames}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
      volume={this.state.settings.volume}
      addMultipleVaris={this.addMultipleVaris}
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
      get_compatible_variations={this.get_compatible_variations}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
      volume={this.state.settings.volume}
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
    const signupPage = ({ match, history }) => <SignupPage
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
      notify={this.notify}
      setLanguage={this.setLanguage}
      language={this.state.language}
      setTheme={this.setTheme}
      colorTheme={this.state.settings.colorTheme}
      wait_time={this.state.settings.wait_time}
      setWaitTime={this.setWaitTime}
      volume={this.state.settings.volume}
      setVolume={value => this.setSetting("volume", value)}
      setVisualChessNotation={this.setVisualChessNotation}
      visual_chess_notation={this.state.settings.visual_chess_notation}
      downloadDatabase={this.downloadDatabase}
    />
    const mailPage = ({ match, history }) => <MailPage
      history={history}
      match={match}
      username={this.state.username}
      inbox={this.state.inbox}
      addOpening={this.addOpening}
      deleteMail={this.deleteMail}
      notify={this.notify}
      updateInbox={this.updateInbox}
    />
    const colorTrainingPage = ({ match, history }) => <ColorTrainingPage
      history={history}
      match={match}
      ops={this.state.user_ops}
      is_move_allowed_color={this.is_move_allowed_color}
      get_pc_move_data_color={this.get_pc_move_data_color}
      get_correct_moves_data_color={this.get_correct_moves_data_color}
      get_compatible_variations={this.get_compatible_variations}
      getComment={this.getComment}
      getDrawBoardPDF={this.getDrawBoardPDF}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
      volume={this.state.settings.volume}
      play_training_finished_sound={this.play_training_finished_sound}
    />
    const variTrainingPage = ({ match, history }) => <GroupTrainingPage
      history={history}
      match={match}
      ops={this.state.user_ops}
      is_move_allowed_group={this.is_move_allowed_group}
      get_pc_move_data_group={this.get_pc_move_data_group}
      get_correct_moves_data_group={this.get_correct_moves_data_group}
      get_compatible_variations={this.get_compatible_variations}
      getComment={this.getComment}
      getDrawBoardPDF={this.getDrawBoardPDF}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
      volume={this.state.settings.volume}
    />
    const analysisPage = ({ match, history }) => <AnalysisPage
      history={history}
      match={match}
      wait_time={this.state.settings.wait_time}
      volume={this.state.settings.volume}
      get_correct_moves_data_book={this.get_correct_moves_data_book}
      ops={this.state.user_ops}
    />
    const smartTrainingPage = ({ match, history }) => <SmartTrainingPage
      history={history}
      match={match}
      ops={this.state.user_ops}
      notify={this.notify}
      wait_time={this.state.settings.wait_time}
      volume={this.state.settings.volume}
      get_pc_move_data={this.get_pc_move_data}
      get_correct_moves_data={this.get_correct_moves_data}
      is_move_allowed={this.is_move_allowed}
      is_move_allowed_color={this.is_move_allowed_color}
      getComment={this.getComment}
      getDrawBoardPDF={this.getDrawBoardPDF}
      onSmartTrainingVariFinished={this.onSmartTrainingVariFinished}
      get_target_vari={this.smart_training_get_target_vari}
      targets_list={targets_list}
    />
    const extraTrainingPage = ({ match, history }) => <ExtraTrainingPage history={history} match={match} />

    const redirectToLogin = () => <Redirect to="/login" />
    const redirectToHome = () => <Redirect to="/" />
    let needLogin = (!this.state.username && !this.state.loadingVisible)

    let noOpenings = this.state.user_ops.length === 0

    const notation_class = "visualChessNotation" + (this.state.settings.visual_chess_notation ? "True" : "False")

    return (
      <LanguageProvider lang={this.state.language}>
        <Router>
          <div id="App" className={`layout ${this.state.settings.colorTheme} ${notation_class}`}>
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
              <Route path="/signup" render={!needLogin ? redirectToHome : signupPage} exact />
              <Route path="/profile" render={needLogin ? redirectToLogin : userPage} exact />
              <Route path="/mail" render={needLogin ? redirectToLogin : mailPage} exact />
              <Route path="/newOpening" render={newOpPage} />
              <Route path="/openings/training/:op_index/:vari_name" render={noOpenings ? redirectToHome : variTrainingPage} />
              <Route path="/newVariation/:op_index/:vari_name" render={newVariPage} />

              <Route path="/openings/:op_index/:vari_name/:color/:board_size/:tab/:moves" render={analysisPage} />
              <Route path="/openings/:op_index/:color/:board_size/:tab/:moves" render={analysisPage} />

              <Route path="/openings/:op_index/:vari_index" render={noOpenings ? redirectToHome : variPage} />
              <Route path="/openings/:op_index" render={/*noOpenings ? redirectToHome : */opPage} />

              <Route path="/training/options" render={noOpenings ? redirectToHome : extraTrainingPage} />

              <Route path="/training/smart" render={/*noOpenings ? redirectToHome : */smartTrainingPage} exact />
              <Route path="/training/fullcolor/:color_number" render={noOpenings ? redirectToHome : colorTrainingPage} />
              <Route path="/training/:op_index" render={noOpenings ? redirectToHome : trainingPage} />

              <Route path="/analysis/:color/:board_size/:tab/:moves" render={analysisPage} />
              <Route path="/" render={() => { console.warn("Error 404. Redirected to home"); return redirectToHome() }} />
            </Switch>
          </div>
        </Router>
      </LanguageProvider>
    )
  }
}

export default App
