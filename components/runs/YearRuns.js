import React from "react";
import {combineRuns, getRunsInTimeRange} from "../../helper/functions";
import MultipleRuns from "../MultipleRuns";
import DateRuns from "./DateRuns";
import dayjs from "dayjs";

export default class YearRuns extends DateRuns {
    getRuns() {
        let years = [];
        const firstYear = this.props.runs[0].date.year();
        const currentYear = dayjs().year();
        
        for (let i = currentYear; i > firstYear - 1; i--) {
            years.push(<div
                key={'yearRun-' + i}
                onClick={() => this.props.changeRunFilter({year: i})}
            ><MultipleRuns
                label={i}
                run={combineRuns(getRunsInTimeRange(this.props.runs, 'year', currentYear, i))}
                isActive={i === this.props.runFilter.year}
            /></div>)
        }

        return years;
    }
}