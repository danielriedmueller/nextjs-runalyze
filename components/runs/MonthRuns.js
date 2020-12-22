import React from "react";
import {combineRuns, getRunsInTimeRange} from "../../helper/functions";
import MultipleRuns from "../MultipleRuns";
import dayjs from "dayjs";
import DateRuns from "./DateRuns";

export default class MonthRuns extends DateRuns {
    getRuns() {
        let months = [];

        const newestRunDate = this.props.runs[this.props.runs.length - 1].date;
        const year = newestRunDate.year();
        const currentYear = dayjs().year();

        const startMonth = year === currentYear ? newestRunDate.month() : 11;
        for (let i = startMonth; i > -1; i--) {
            months.push(<div
                key={'monthRun-' + i}
                onClick={() => this.props.changeRunFilter({month: i})}>
                <MultipleRuns
                    label={dayjs().add(i + 1, 'month').format('MMMM')}
                    run={combineRuns(getRunsInTimeRange(this.props.runs, 'month', year, i))}
                    isActive={i === this.props.runFilter.month}
                /></div>)
        }

        return months;
    }
}