import React, { Component } from "react"
import dayjs from "dayjs"
import Translator from "./Translator"

class CommitmentCalendar extends Component {
    constructor(props) {
        super(props);
        this.month_table = this.month_table.bind(this);
    }

    // -1: day1 < day2
    //  0: day1 = day2
    // +1: day1 > day2
    compare_days(day1, day2) {
        if(day1.year < day2.year) return -1;
        if(day1.year > day2.year) return +1;

        if(day1.month < day2.month) return -1;
        if(day1.month > day2.month) return +1;

        if(day1.day < day2.day) return -1;
        if(day1.day > day2.day) return +1;

        return 0;
    }

    // no day should appear in two streaks at the same time
    day_is_in_streak(day, streaks){
        for(let i = 0; i < streaks.length; i++){
            const st = streaks[i]
            const cmp_from = this.compare_days(day, st.from);
            const cmp_to = this.compare_days(day, st.to);

            // console.log(day, cmp_from, cmp_to, cmp_from > 0 && cmp_to < 0 )

            if( cmp_from > 0 && cmp_to < 0 ){
                return {
                    streak: st, pos: "Mid"
                };
            }else if( cmp_from === 0 ){
                return {
                    streak: st, pos: "From"
                };
            }else if( cmp_to === 0 ){
                return {
                    streak: st, pos: "To"
                };
            }
        };
        return null;
    }

    month_table(year, month) {
        const monday_week = {0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5};

        let this_today = {year: dayjs().year(), month: dayjs().month() + 1, day: dayjs().date()};

        let first_day = new Date(year, month - 1, 1);
        let first_day_num_week = this.props.sundayFirst ? dayjs(first_day).day() : monday_week[dayjs(first_day).day()];
        let num_of_days = dayjs(first_day).daysInMonth();
        let num_of_weeks = Math.ceil((num_of_days + first_day_num_week) / 7);

        const levels = 3;

        let weeks_obj = [];
        for(let w = 0; w < num_of_weeks; w++){
            let days_obj = [];
            for(let d = 1; d <= 7; d++){
                let today_obj = null;
                let day_num = w*7 + d - first_day_num_week;
                let today_value = this.props.days ? (
                    this.props.days.find(elem => elem.year === year && elem.month === month && elem.day === day_num)
                ) : 0;
                if(today_value === undefined) {
                    today_value = 0;
                }else{
                    today_value = today_value.value !== undefined ? today_value.value : 0;
                };
                let percent = 0;
                if(this.props.maxValue <= 0) {
                    if(today_value > 0) { percent = 1; } else { percent = 0; }
                }else{
                    percent = Math.min(1, Math.max(0, today_value / this.props.maxValue));   
                }
                let level_num = Math.min(levels, Math.ceil(percent * levels) + 1);

                let level_class = "calendarLevel" + level_num.toString();

                let extraClasses = "";
                let in_st = this.day_is_in_streak({year, month, day: day_num}, this.props.streaks)
                if(in_st !== null){
                    extraClasses += " streak" + in_st.pos;
                }
                
                if(this.compare_days({year,month,day:day_num}, this_today) === 1){
                    extraClasses += " calendarFutureDay";
                }

                if(d === 7) extraClasses += " daySunday";

                if(day_num > num_of_days || day_num < 1) {
                    day_num -= num_of_days;
                    today_obj = <td 
                        className={"calendarEmptyDay" + extraClasses} 
                        key={"emptyday-" + year.toString() + "-" + month.toString() + "-" + d.toString()}
                    ></td>;
                }else{
                    today_obj = <td  
                        className={"calendarDay " + level_class + extraClasses} 
                        key={"day-" + year.toString() + "-" + month.toString() + "-" + d.toString()}
                    >{day_num}</td>;
                }
                days_obj.push(today_obj);
            }
            weeks_obj.push(
                <tr className="calendarWeek" key={first_day + "-month-" + w.toString()}>
                    {days_obj}
                </tr>
            );
        }

        const month_names = {
            1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August",
            9: "September", 10: "October", 11: "November", 12: "December"
        }

        return <div className="calendarMonthContainer" key={"container_month_" + month.toString() + "_year_" + year.toString() + "_" + this.props.title }>
            <h2 key={"title_month_" + month.toString() + "_year_" + year.toString() + "_" + this.props.title }>
                {year.toString() + " "}<Translator text={month_names[month]}/>    
            </h2>
            <table 
                key={"month_" + month.toString() + "_year_" + year.toString() + "_" + this.props.title }
                id={"month_" + month.toString() + "_year_" + year.toString() + "_" + this.props.title }
                className="calendarMonthTable"
            >
                <tbody>
                    {weeks_obj}
                </tbody>
            </table>
        </div>;
    }

    calendar_table(days) {
        let first_day = {year: dayjs().year(), month: dayjs().month() + 1, day: dayjs().date()};
        let today = {year: dayjs().year(), month: dayjs().month() + 1, day: dayjs().date()};
        if(days !== undefined && days !== null){
            days.forEach(stat_day => {
                if(this.compare_days(stat_day, first_day) === -1) {
                    first_day = stat_day;
                }
            })
        }

        let months = [];
        for(let yy = first_day.year; yy <= today.year; yy++){
            console.log(yy, first_day.year, today.year)
            let max_mm = 12;
            if(today.year === yy) max_mm = today.month;
            for(let mm = 1; mm <= max_mm; mm++){
                months.push(this.month_table(yy, mm))
            }
        }

        return months;
    }

    render() {
        return <div 
            id={"calendar_" + this.props.title} 
            key={"calendar_" + this.props.title} 
            className="commitmentCalendarContainer"
        >
            {this.calendar_table(this.props.days)}
        </div>; 
    }
}

export default CommitmentCalendar
