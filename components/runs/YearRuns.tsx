import React, {ReactNode} from "react";
import DateRuns from "./DateRuns";
import dayjs from "dayjs";
import MultipleRuns from "./MultipleRuns";

export default class YearRuns extends DateRuns {
    getRunViews(): ReactNode[] {
        const filter = this.props.filter;

        if (this.props.runs.getCount() === 0) return [];

        let years = [];

        const newestYear = this.props.runs.getNewest().date.year();
        const oldestYear = this.props.runs.getFirst().date.year();

        const onClick = (year: number) => {
            if (year === filter.year) {
                year = null;
            }
            filter.year = year;
            this.props.setDateFilter(filter);
        }

        for (let i = newestYear; i > oldestYear - 1; i--) {
            const currentYear = dayjs('01-01-' + i);
            years.push(<div
                key={'yearRun-' + i}
            ><MultipleRuns
                label={i.toString()}
                runs={this.props.runs.getBetween(
                    currentYear.startOf('year'),
                    currentYear.endOf('year')
                )}
                active={i === filter.year}
                onClick={() => onClick(i)}
            /></div>)
        }

        return years;
    }
}
