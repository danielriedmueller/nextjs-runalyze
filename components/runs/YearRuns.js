import React from "react";
import {combineRuns, getRunsBetween, getRunsInTimeRange} from "../../helper/functions";
import MultipleRuns from "../MultipleRuns";
import DateRuns from "./DateRuns";
import dayjs from "dayjs";

export default class YearRuns extends DateRuns {
    getRuns() {
        if (this.props.runs.length === 0) return [];

        let years = [];

        const latestYear = this.props.runs[0].date.year();
        const firstYear = this.props.runs[this.props.runs.length - 1].date.year();

        for (let i = latestYear; i > firstYear - 1; i--) {
            const currentYear = dayjs('01-01-' + i);
            years.push(<div
                key={'yearRun-' + i}
                onClick={() => this.props.changeFilter(String(i))}
            ><MultipleRuns
                label={i}
                run={combineRuns(getRunsBetween(this.props.runs, [
                    currentYear.startOf('year'),
                    currentYear.endOf('year'),
                ]))}
                isActive={String(i) === this.props.runFilter.year}
            /></div>)
        }

        return years;
    }
}