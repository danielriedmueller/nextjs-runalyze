import React, {FC, ReactElement, ReactNode} from "react";
import dayjs from "dayjs";
import MultipleRunsView from "./MultipleRunsView";
import style from "../../style/runs.module.scss";
import IRuns from "../../interfaces/IRuns";
import IDateFilter from "../../interfaces/IDateFilter";
import {ArithmeticModes} from "../../pages";

interface IProps {
    runs: IRuns;
    filter: IDateFilter;
    setDateFilter: (filter: IDateFilter) => void;
    mode: ArithmeticModes;
}

const MonthRuns: FC<IProps> = ({runs, filter, setDateFilter, mode}): ReactElement => {
    const getRunViews = (): ReactNode[] => {
        if (runs.getCount() < 2 || !filter.year) return [];

        let months = [];

        const firstMonth = 1;
        const lastMonth = 12;

        const onClick = (month: number) => {
            if (month === filter.month) {
                month = null;
            }
            filter.month = month;
            setDateFilter(filter);
        }

        for (let i = lastMonth; i > firstMonth - 1; i--) {
            const currentMonth = dayjs(i + '-01-' + filter.year);
            const monthRuns = runs.getBetween(
                currentMonth.startOf('month'),
                currentMonth.endOf('month')
            );
            if (monthRuns.getCount() > 0) {
                months.push(<MultipleRunsView
                    key={'monthRun-' + i}
                    label={currentMonth.format('MMMM')}
                    runs={monthRuns}
                    active={i === filter.month}
                    onClick={() => onClick(i)}
                    mode={mode}
                />)
            }
        }

        return months;
    }

    return <div className={style.table}>{getRunViews()}</div>;
}

export default MonthRuns;
