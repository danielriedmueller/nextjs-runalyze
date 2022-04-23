import React from "react";
import dayjs from "dayjs";
import DateRuns from "./DateRuns";
import MultipleRuns from "./MultipleRuns";

export default class MonthRuns extends DateRuns {
    getRunViews() {
        const runs = this.props.runs;
        const filter = this.props.filter;

        if (runs.getCount() === 0 || !filter.year) return [];

        let months = [];

        const firstMonth = 1;
        const lastMonth = 12;

        const onClick = (month: number) => {
            if (month === filter.month) {
                month = null;
            }
            filter.month = month;
            this.props.setDateFilter(filter);
        }

        for (let i = lastMonth; i > firstMonth - 1; i--) {
            const currentMonth = dayjs(i + '-01-' + filter.year);
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
                    active={i === filter.month}
                    onClick={() => onClick(i)}
                /></div>)
            }
        }

        return months;
    }
}
