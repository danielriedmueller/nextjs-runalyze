import React, {FC, ReactElement, useEffect, useState} from "react";
import style from '../style/runarea.module.scss';
import IRuns from "../interfaces/IRuns";
import YearRuns from "./runs/YearRuns";
import MonthRuns from "./runs/MonthRuns";
import WeekRuns from "./runs/WeekRuns";
import IDateFilter from "../interfaces/IDateFilter";
import SingleRuns from "./runs/SingleRuns";
import CurrentRunView from "./runs/CurrentRunView";
import IRun from "../interfaces/IRun";
import {ArithmeticModes} from "../pages";

interface IProps {
    runs: IRuns;
    filter: IDateFilter;
    setDateFilter: (filter: IDateFilter) => void;
    mode: ArithmeticModes;
}

const RunArea: FC<IProps> = ({runs, filter, setDateFilter, mode}): ReactElement => {
    const [currentRun, setCurrentRun] = useState<IRun>();

    useEffect(() => {
        _setCurrentRun(runs.getFiltered(filter).getNewest());
    }, [filter.year, filter.month, filter.week]);

    const _setCurrentRun = (run?: IRun): void => {
        if (currentRun) currentRun.isCurrent = false;
        if (run) run.isCurrent = true;

        setCurrentRun(run);
    }

    return <>
        <div className={style.currentRun}>
            <CurrentRunView run={currentRun}/>
        </div>
        <div className={style.runarea}>
            <SingleRuns
                runs={runs.getFiltered(filter)}
                setCurrentRun={_setCurrentRun}
            />
            <WeekRuns
                runs={runs.getFiltered(filter, 'month')}
                filter={filter}
                setDateFilter={setDateFilter}
                mode={mode}
            />
            <MonthRuns
                runs={runs.getFiltered(filter, 'year')}
                filter={filter}
                setDateFilter={setDateFilter}
                mode={mode}
            />
            <YearRuns
                runs={runs}
                filter={filter}
                setDateFilter={setDateFilter}
                mode={mode}
            />
        </div>
    </>
}

export default RunArea;
