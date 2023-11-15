import React, { Component } from "react"
import CommitmentCalendar from "../components/CommitmentCalendar"
import Header from "../components/Header"
import dayjs from "dayjs"

class StatsPage extends Component {
  get_calendar_values(stats){
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

  render() {
    return (
      <React.Fragment>
        <Header title={this.props.username} mainButtonText="arrow_back" />
        <div id="statsPage" className="page">
          <div style={{"alignContent": "center"}}>
            {/*<h1>Score: <span className="impText">{this.props.user_over_all_score().total_score_str}</span></h1>*/}
            <CommitmentCalendar 
              title="streaks"
              values={this.get_calendar_values(this.props.stats)} 
              colors={[
                "var(--calendarColor1)",
                "var(--calendarColor2)",
                "var(--calendarColor3)",
                "var(--calendarColor4)",
                "var(--calendarColor5)",
                "var(--calendarColor6)",
                "var(--calendarColor7)",
                "var(--calendarColor8)"
              ]}
              maxValue={150}
              streaks={[]}
              // streaks={[{
              //     from: {year: 2023, month: 1, day:1},
              //     to: {year: 2023, month: 1, day:10},
              //     color: "#686ae2"
              // }]}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default StatsPage
