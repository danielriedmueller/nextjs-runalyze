import React from "react";
import {combineRuns, getRunsBetween, getRunsInTimeRange} from "../../helper/functions";
import MultipleRuns from "../MultipleRuns";
import dayjs from "dayjs";
import DateRuns from "./DateRuns";

export default class MonthRuns extends DateRuns {
    getRuns() {
        if (this.props.runs.length === 0) return [];

        let months = [];

        const newestRunDate = this.props.runs[0].date;
        const currentYear = newestRunDate.year();

        for (let i = newestRunDate.month() + 1; i >= 1; i--) {
            const currentMonth = dayjs(i + '-01' + '-' + currentYear);

            months.push(<div
                key={'monthRun-' + i}
                onClick={() => this.props.changeFilter(i)}>
                <MultipleRuns
                    label={dayjs().add(i, 'month').format('MMMM')}
                    run={combineRuns(getRunsBetween(this.props.runs, [
                        currentMonth.startOf('month'),
                        currentMonth.endOf('month'),
                    ]))}
                    isActive={i === this.props.runFilter.month}
                /></div>)
        }

        return months;
    }
}