import React, {ReactNode} from "react";
import DateRuns from "./DateRuns";
import dayjs from "dayjs";
import MultipleRuns from "./MultipleRuns";

export default class YearRuns extends DateRuns {
    getRunViews(): ReactNode[] {
        if (this.props.runs.getCount() === 0) return [];

        let years = [];

        const firstYear = this.props.runs.getFirst().date.year();
        const latestYear = this.props.runs.getLatest().date.year();

        const onClick = (year: number) => {
            this.props.setDateFilter(year.toString());
        }

        for (let i = latestYear; i > firstYear - 1; i--) {
            const currentYear = dayjs('01-01-' + i);
            years.push(<div
                key={'yearRun-' + i}
            ><MultipleRuns
                label={i.toString()}
                runs={this.props.runs.getBetween(
                    currentYear.startOf('year'),
                    currentYear.endOf('year')
                )}
                onClick={() => onClick(i)}
            /></div>)
        }

        return years;
    }
}
