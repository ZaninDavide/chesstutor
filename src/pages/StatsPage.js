import React, { Component } from "react"
import CommitmentCalendar from "../components/CommitmentCalendar"
import Header from "../components/Header"
import dayjs from "dayjs"

class StatsPage extends Component {
  get_calendar_days(stats){
    if(stats === undefined || stats === null){
      console.log("get_calendar_values: stats not found.")
      return []
    };
    return Object.entries(stats).map(stat => {
      let res = {year: 0, month: 0, day: 0, value: 0};
      let dd = dayjs(stat[0]*1000);
      res.year = dd.year();
      res.month = dd.month() + 1;
      res.day = dd.date();
      res.value = stat[1].white_moves + stat[1].black_moves;
      return res;
    })
  }

  get_streaks(days, goal) {
    if(goal <= 0) return [];
    let streaks = [];
    let from = null;
    let to = null;
    let last = null;
    days.push({year:5000, month:1, day:1, value: 0}); // this forces the code to push the last streak
    for(let i = 0; i < days.length; i++) {
      let delta = 1;
      if (last !== null){
        delta = Math.round((
            (new Date(days[i].year, days[i].month - 1, days[i].day)) -
            (new Date(last.year, last.month - 1, last.day))
          ) / 1000 / 60 / 60 / 24); // we need to round because days aren't exactly 24 hours
      }
      if(
        (days[i].value >= goal && delta === 1 && from !== null) || 
        (days[i].value >= goal && from === null)
      ){
        if(from !== null){
          to = days[i];
        }else{
          from = days[i];
          to = null;
        }
      }else{
        if(from !== null && to !== null){
          streaks.push({from: from, to: to})
          from = null;
          to = null;
        }
      }
      last = days[i];
    }
    return streaks;
  }

  render() {
    const days = this.get_calendar_days(this.props.stats);
    return (
      <React.Fragment>
        <Header title={this.props.username} mainButtonText="arrow_back" />
        <div id="statsPage" className="page">
          <div style={{"alignContent": "center"}}>
            <CommitmentCalendar 
              title="streaks"
              days={days}
              maxValue={this.props.settings.moves_goal}
              streaks={this.get_streaks(days, this.props.settings.moves_goal)}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default StatsPage
