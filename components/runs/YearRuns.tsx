import React, {FC, ReactElement, ReactNode} from "react";
import MultipleRunsView from "./MultipleRunsView";
import style from "../../style/runs.module.scss";
import IRuns from "../../interfaces/IRuns";
import IDateFilter from "../../interfaces/IDateFilter";
import {getYearRuns} from "../../helper/filteredRuns";
import {ArithmeticModes} from "../../pages";

interface IProps {
    runs: IRuns;
    filter: IDateFilter;
    setDateFilter: (filter: IDateFilter) => void;
    mode: ArithmeticModes;
}

const YearRuns: FC<IProps> = ({runs, filter, setDateFilter, mode}): ReactElement => {
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
            years.push(<MultipleRunsView
                key={'yearRun-' + i}
                label={i.toString()}
                runs={getYearRuns(runs, i)}
                active={i === filter.year}
                onClick={() => onClick(i)}
                mode={mode}
            />)
        }

        return years;
    }

    return <div className={style.table}>{getRunViews()}</div>;
}

export default YearRuns;
