import React, {FC, ReactElement, ReactNode} from "react";
import dayjs from "dayjs";
import MultipleRuns from "./MultipleRuns";
import style from "../../style/runs.module.scss";
import IRuns from "../../interfaces/IRuns";
import IDateFilter from "../../interfaces/IDateFilter";
import {getYearRuns} from "../../helper/filteredRuns";

interface IProps {
    runs: IRuns;
    filter: IDateFilter;
    setDateFilter: (filter: IDateFilter) => void;
}

const YearRuns: FC<IProps> = ({runs, filter, setDateFilter}): ReactElement => {
    const getRunViews = (): ReactNode[] => {
        if (runs.getCount() === 0) return [];

        const onClick = (year: number) => {
            if (year === filter.year) {
                year = null;
            }
            filter.year = year;
            setDateFilter(filter);
        }

        let years = [];

        for (let i = runs.getNewest().date.year(); i > runs.getFirst().date.year() - 1; i--) {
            years.push(<div
                key={'yearRun-' + i}
            ><MultipleRuns
                label={i.toString()}
                runs={getYearRuns(runs, i)}
                active={i === filter.year}
                onClick={() => onClick(i)}
            /></div>)
        }

        return years;
    }

    return <div className={style.table}>{getRunViews()}</div>;
}

export default YearRuns;
