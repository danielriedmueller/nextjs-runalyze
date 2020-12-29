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
            const index = week[0];
            const runs = week[1];
            const firstRunDate = runs[0].date;

            const startOf = firstRunDate.startOf('week').format('DD.MM - ');
            const endOf = firstRunDate.endOf('week').format('DD.MM');
            const kw = firstRunDate.week();
            multipleRuns.push(
                <div
                    key={'weekRun-' + index}
                    onClick={() => this.props.changeFilter(kw)}>
                    <MultipleRuns
                        label={"Woche vom " + startOf + endOf}
                        run={combineRuns(runs)}
                        isActive={kw === this.props.runFilter.week}
                    /></div>
            )
        })

        return multipleRuns.reverse();
    }
}