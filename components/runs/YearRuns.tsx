import React, {FC, ReactElement, ReactNode} from "react";
import dayjs from "dayjs";
import MultipleRuns from "./MultipleRuns";
import style from "../../style/runs.module.scss";
import IRuns from "../../interfaces/IRuns";
import IDateFilter from "../../interfaces/IDateFilter";

interface IProps {
    runs: IRuns;
    filter: IDateFilter;
    setDateFilter: (filter: IDateFilter) => void;
}

const YearRuns: FC<IProps> = ({runs, filter, setDateFilter}): ReactElement => {
    const getRunViews = (): ReactNode[] => {
        if (runs.getCount() === 0) return [];

        let years = [];

        const newestYear = runs.getNewest().date.year();
        const oldestYear = runs.getFirst().date.year();

        const onClick = (year: number) => {
            if (year === filter.year) {
                year = null;
            }
            filter.year = year;
            setDateFilter(filter);
        }

        for (let i = newestYear; i > oldestYear - 1; i--) {
            const currentYear = dayjs('01-01-' + i);
            years.push(<div
                key={'yearRun-' + i}
            ><MultipleRuns
                label={i.toString()}
                runs={runs.getBetween(
                    currentYear.startOf('year'),
                    currentYear.endOf('year')
                )}
                active={i === filter.year}
                onClick={() => onClick(i)}
            /></div>)
        }

        return years;
    }

    return <div className={style.table}>{getRunViews()}</div>;
}

export default YearRuns;
