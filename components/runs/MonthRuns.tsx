import React from "react";
import dayjs from "dayjs";
import DateRuns from "./DateRuns";
import MultipleRuns from "./MultipleRuns";

export default class MonthRuns extends DateRuns {
    getRunViews() {
        const runs = this.props.runs;
        if (runs.getCount() === 0 || !runs.filter) return [];

        let months = [];

        const firstMonth = 1;
        const lastMonth = 12;

        const onClick = (month: number) => {
            this.props.setDateFilter(runs.filter + ";" + month.toString());
        }

        for (let i = lastMonth; i > firstMonth - 1; i--) {
            const currentMonth = dayjs(i + '-01-' + runs.filter);
            const monthRuns = runs.getBetween(
                currentMonth.startOf('month'),
                currentMonth.endOf('month')
            );
            if (monthRuns.getCount() > 0) {
                months.push(<div
                    key={'monthRun-' + i}
                ><MultipleRuns
                    label={i.toString()}
                    runs={monthRuns}
                    onClick={() => onClick(i)}
                /></div>)
            }
        }

        return months;
    }
}
