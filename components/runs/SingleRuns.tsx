import React, {Component, FC, ReactElement, ReactNode} from "react";
import style from '../../style/runs.module.scss';
import SingleRunView from "./SingleRunView";
import IRuns from "../../interfaces/IRuns";

interface IProps {
    runs: IRuns;
}

const SingleRuns: FC<IProps> = ({runs}): ReactElement => {
    const getRunViews = (): ReactNode[] => {
        if (runs.getCount() === 0) return [];

        return runs.toArray().map((run, index) => {
            return <div
                key={'singleRun-' + index}
            ><SingleRunView
                run={run}
            /></div>
        })
    }

    return <div className={style.table}>{getRunViews()}</div>;
}

export default SingleRuns;
