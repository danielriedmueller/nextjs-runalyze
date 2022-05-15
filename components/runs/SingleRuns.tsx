import React, {FC, ReactElement, ReactNode} from "react";
import style from '../../style/runs.module.scss';
import SingleRunView from "./SingleRunView";
import IRuns from "../../interfaces/IRuns";
import IRun from "../../interfaces/IRun";
import {chooseBest} from "../../helper/trends";

interface IProps {
    runs: IRuns;
    setCurrentRun: (run?: IRun) => void;
}

const SingleRuns: FC<IProps> = ({runs, setCurrentRun}): ReactElement => {
    const getRunViews = (): ReactNode[] => {
        if (runs.getCount() === 0) return [];

        const sortForBest = (a, b) => {
            if (!a.isBestInSomething()) {
                return 1;
            }

            if (a.isBestInSomething() && !b.isBestInSomething()) {
                return -1;
            }

            return 0;
        };

        const runsArr = runs.toArray();
        chooseBest(runsArr);

        return runsArr.sort(sortForBest).map((run, index) => {
            return <SingleRunView
                key={'singleRun-' + index}
                run={run}
                onClick={() => setCurrentRun(run)}
            />
        });
    }

    return <div className={style.table}>{getRunViews()}</div>;
}

export default SingleRuns;
