import React from "react";
import {combineRuns} from "../../helper/functions";
import MultipleRuns from "../MultipleRuns";
import DateRuns from "./DateRuns";

export default class WeekRuns extends DateRuns {
    getRuns() {
        if (this.props.runs.length === 0) return [];

        const weeks = this.props.runs.reduce((acc, curr) => {
            const week = curr.date.week();
            if (!acc[week]) {
                acc[week] = []
            }
            acc[week].push(curr);
            return acc;
        },{});

        const multipleRuns = [];
        Object.entries(weeks).forEach(week => {
            multipleRuns.push(
                <div
                    key={'weekRun-' + week[0]}
                    onClick={() => this.props.setFilteredRuns(week[1], week[0])}>
                    <MultipleRuns
                        label={"KW" + week[0]}
                        run={combineRuns(week[1])}
                        isActive={week[0] === this.props.runFilter.week}
                    /></div>
            )
        })

        return multipleRuns.reverse();
    }
}