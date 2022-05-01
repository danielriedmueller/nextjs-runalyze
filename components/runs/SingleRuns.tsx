import React, {Dispatch, FC, ReactElement, ReactNode, SetStateAction} from "react";
import style from '../../style/runs.module.scss';
import SingleRunView from "./SingleRunView";
import IRuns from "../../interfaces/IRuns";
import IRun from "../../interfaces/IRun";

interface IProps {
    runs: IRuns;
    setCurrentRun: (run?: IRun) => void;
}

const SingleRuns: FC<IProps> = ({runs, setCurrentRun}): ReactElement => {
    const getRunViews = (): ReactNode[] => {
        if (runs.getCount() === 0) return [];

        return runs.toArray().map((run, index) => {
            return <div
                key={'singleRun-' + index}
            ><SingleRunView
                run={run}
                onClick={() => setCurrentRun(run)}
            /></div>
        })
    }

    return <div className={style.table}>{getRunViews()}</div>;
}

export default SingleRuns;
