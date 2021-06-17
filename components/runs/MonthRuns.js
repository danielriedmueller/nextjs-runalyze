import React from "react";
import {combineRuns, getRunsBetween, getRunsInTimeRange, splitRunsInMonths} from "../../helper/functions";
import MultipleRuns from "../MultipleRuns";
import dayjs from "dayjs";
import DateRuns from "./DateRuns";

export default class MonthRuns extends DateRuns {
    getRuns() {
        if (this.props.runs.length === 0) return [];

        var months = [];

        const newestRunDate = this.props.runs[0].date;
        const currentYear = newestRunDate.year();

        const splittedRuns = splitRunsInMonths(this.props.runs);

        for (const [month, runs] of Object.entries(splittedRuns)) {
            months.push(<div
                key={'monthRun-' + month}
                onClick={() => this.props.changeFilter(month)}>
                <MultipleRuns
                    label={dayjs().month(month - 1).format('MMMM')}
                    run={combineRuns(runs)}
                    isActive={month === this.props.runFilter.month}
                /></div>)
        }

        return months.reverse();
    }
}