import React, { Component } from "react"
import Header from "../components/Header"
import Board from "../components/Board"
import Translator from "../components/Translator"
import { SMART_TRAINING_MODE } from "../utilities/constants"
import dayjs from "dayjs"

class SmartTrainingPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      targets_list: [], // list of variations you need to study
    }

    this.get_target_vari = this.get_target_vari.bind(this);
    this.smartTrainingVariFinished = this.smartTrainingVariFinished.bind(this);
    this.onSmartTrainingVariFinished = this.onSmartTrainingVariFinished.bind(this);
  }

  componentWillMount() {
    // calculate the targets_list
    if(this.props.ops){
      let start_targets_list = []

      // TODO: consider moving this step into App.js

      this.props.ops.forEach((op, op_index) => {
        if(op.archived) return;

        op.variations.forEach((vari, vari_index) => {
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
            vari_op_index: op_index,
            vari_index: vari_index,
          })
        })
      })

      // you don't need to train now
      if(start_targets_list.length === 0) {
        this.props.notify("You don't need to train any more for today.", "important")
        return false
      }else{
        this.props.notify("You have " + start_targets_list.length + " variations to train on for today.", "important")
      }

      this.setState({
        targets_list: start_targets_list,
      })
    }
  }

  get_target_vari() {
    const target_vari_color = this.state.targets_list.length > 0 ? this.state.targets_list[0].vari_color : "none"
    const target_vari_op_index = this.state.targets_list.length > 0 ? this.state.targets_list[0].vari_op_index : null
    const target_vari_index = this.state.targets_list.length > 0 ? this.state.targets_list[0].vari_index : null
    let smart_training_target_vari = null;
    if(
      target_vari_color !== null &&
      target_vari_color !== "none" &&
      target_vari_op_index !== null &&
      target_vari_index !== null &&
      this.props.ops && 
      this.props.ops.length > target_vari_op_index &&
      this.props.ops[target_vari_op_index].variations.length > target_vari_index
    ){
      smart_training_target_vari = this.props.ops[target_vari_op_index].variations[target_vari_index]
    }
    return smart_training_target_vari
  }

  smartTrainingVariFinished(number_of_errors, callback) {
    const target_vari = this.get_target_vari()
    const target_vari_op_index = this.state.targets_list.length > 0 ? this.state.targets_list[0].vari_op_index : null
    const target_vari_index = this.state.targets_list.length > 0 ? this.state.targets_list[0].vari_index : null

    if(target_vari){
      const new_vari_score = get_new_vari_score(
        number_of_errors_to_quality(number_of_errors),
        target_vari.vari_score ? target_vari.vari_score.schedule : null,
        target_vari.vari_score ? target_vari.vari_score.factor : null
      )
  
      this.props.updateVariScore(
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

  onSmartTrainingVariFinished(number_of_errors, resetBoard_callback) {
    // save this training
    this.smartTrainingVariFinished(number_of_errors, () => {
      if(this.state.targets_list.length <= 1) {
        // TODO: BIGGER CONGRATS + SEND THE USER TO THE HOME PAGE
        this.props.notify("You don't need to train any more for today.", "important")
        return false
      }else{
        this.setState(old => {
          let new_targets_list = old.targets_list
          new_targets_list.shift() // remove first element
          return {
            targets_list: new_targets_list,
          }
        }, () => setTimeout(resetBoard_callback, 500)) // TODO: you can try to move even if you have finished
      }
    })
  }

  render() {
    const smart_training_target_vari = this.get_target_vari()
    const target_vari_color = this.state.targets_list.length > 0 ? this.state.targets_list[0].vari_color : "none"
    const target_vari_op_index = this.state.targets_list.length > 0 ? this.state.targets_list[0].vari_op_index : null
    const target_vari_index = this.state.targets_list.length > 0 ? this.state.targets_list[0].vari_index : null
    const target_vari_name = smart_training_target_vari ? smart_training_target_vari.vari_name : null
    const target_vari_subname = smart_training_target_vari ? smart_training_target_vari.vari_subname : null

    return (
      <React.Fragment>
        <Header mainButtonText="arrow_back" goTo={"/"} title={<React.Fragment><Translator text={"Daily training"} /></React.Fragment>} />
        <Board
          key="trainingBoard"
          mode={SMART_TRAINING_MODE}

          history={this.props.history}
          ops={this.props.ops}

          playColor={target_vari_color}
          rotation={target_vari_color}
          smart_training_target_vari={smart_training_target_vari}
          onSmartTrainingVariFinished={this.onSmartTrainingVariFinished}
          target_vari_op_index={target_vari_op_index}
          target_vari_index={target_vari_index}
          target_vari_color={target_vari_color}
          target_vari_name={target_vari_name}
          target_vari_subname={target_vari_subname}

          get_pc_move_data={this.props.get_pc_move_data}
          get_correct_moves_data={this.props.get_correct_moves_data}
          is_move_allowed={this.props.is_move_allowed}
          is_move_allowed_color={this.props.is_move_allowed_color}

          getComment={this.props.getComment}
          getDrawBoardPDF={this.props.getDrawBoardPDF}

          buttons={["back", "help", "more"]}
          moreMenuButtons={["analyse", "flip", "smallBoard"]}
          tabs={["moves", "vari_info", "op_name"]}

          notify={this.props.notify}
          wait_time={this.props.wait_time}
          volume={this.props.volume}
        />
      </React.Fragment>
    )
  }
}

// SMART TRAINING ALGORITHM

function number_of_errors_to_quality(n) {
  return Math.max(0, Math.floor(5 - n))
}

function get_new_vari_score(quality, lastSchedule, lastFactor) {
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

export default SmartTrainingPage
