import React from "react";
import DateRuns from "./DateRuns";
import dayjs from "dayjs";
import MultipleRuns from "./MultipleRuns";

export default class WeekRuns extends DateRuns {
    getRunViews() {
        const runs = this.props.runs;
        if (runs.getCount() === 0 || !runs.filter.year || !runs.filter.month) return [];

        let weeks = [];

        const date = dayjs(runs.filter.month + '-01-' + runs.filter.year);
        const firstWeek = date.startOf('month').week();
        const lastWeek = date.endOf('month').week();
        let filter = this.props.runs.filter;

        const onClick = (week: number) => {
            if (week === filter.week) {
                week = null;
            }
            filter.week = week;
            this.props.setDateFilter(filter);
        }

        for (let i = lastWeek; i > firstWeek - 1; i--) {
            const currentWeek = date.week(i);
            const weekRuns = runs.getBetween(
                currentWeek.startOf('week'),
                currentWeek.endOf('week')
            );
            if (weekRuns.getCount() > 0) {
                weeks.push(<div
                    key={'monthRun-' + i}
                ><MultipleRuns
                    label={i.toString()}
                    runs={weekRuns}
                    active={i === filter.week}
                    onClick={() => onClick(i)}
                /></div>)
            }
        }

        return weeks;
    }
}
