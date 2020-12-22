import React from "react";
import {combineRuns, getRunsInTimeRange} from "../../helper/functions";
import MultipleRuns from "../MultipleRuns";
import DateRuns from "./DateRuns";

export default class WeekRuns extends DateRuns {
    getRuns() {
        let weeks = [];

        const newestRunDate = this.props.runs[this.props.runs.length - 1].date;

        const year = newestRunDate.year();

        let end = newestRunDate.week();
        const start = this.props.runs[0].date.week();

        if (end === 1 && start !== 1) {
            end = newestRunDate.isoWeeksInYear();
        }

        for (let i = end; i > start - 1; i--) {
            weeks.push(<div
                key={'weekRun-' + i}
                onClick={() => this.props.changeRunFilter({week: i})}>
                <MultipleRuns
                    label={"KW " + i}
                    run={combineRuns(getRunsInTimeRange(this.props.runs, 'week', year, i))}
                    isActive={i === this.props.runFilter.week}
                /></div>)
        }

        return weeks;
    }
}