import React, {FC, ReactElement, ReactNode} from "react";
import dayjs from "dayjs";
import MultipleRuns from "./MultipleRuns";
import IRuns from "../../interfaces/IRuns";
import IDateFilter from "../../interfaces/IDateFilter";
import style from "../../style/runs.module.scss";

interface IProps {
    runs: IRuns;
    filter: IDateFilter;
    setDateFilter: (filter: IDateFilter) => void;
}

const WeekRuns: FC<IProps> = ({runs, filter, setDateFilter}): ReactElement => {
    const getRunViews = (): ReactNode[] => {
        if (runs.getCount() < 2 || !filter.year || !filter.month) return [];

        let weeks = [];

        const date = dayjs(filter.month + '-01-' + filter.year);
        const firstWeek = date.startOf('month').week();
        const lastWeek = date.endOf('month').week();

        const onClick = (week: number) => {
            if (week === filter.week) {
                week = null;
            }
            filter.week = week;
            setDateFilter(filter);
        }

        for (let i = lastWeek; i > firstWeek - 1; i--) {
            const currentWeek = date.week(i);
            const startOfWeek = currentWeek.startOf('week');
            const endOfWeek = currentWeek.endOf('week');
            const weekRuns = runs.getBetween(startOfWeek, endOfWeek);
            const label = startOfWeek.format('DD.MM.') + ' - ' + endOfWeek.format('DD.MM.');
            if (weekRuns.getCount() > 0) {
                weeks.push(<div
                    key={'monthRun-' + i}
                ><MultipleRuns
                    label={label}
                    runs={weekRuns}
                    active={i === filter.week}
                    onClick={() => onClick(i)}
                /></div>)
            }
        }

        return weeks;
    }

    return <div className={style.table}>{getRunViews()}</div>;
}

export default WeekRuns;
