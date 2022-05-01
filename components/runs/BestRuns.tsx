import React, {Dispatch, FC, ReactElement, SetStateAction} from "react";
import style from '../../style/runs.module.scss';
import SingleRunView from "./SingleRunView";
import IRuns from "../../interfaces/IRuns";
import IRun from "../../interfaces/IRun";

interface IProps {
    runs: IRuns;
    setCurrentRun: (run?: IRun) => void;
}

const BestRuns: FC<IProps> = ({runs, setCurrentRun}): ReactElement => <div className={style.table}>
    <SingleRunView
        run={runs.getMostPerformant()}
        onClick={() => setCurrentRun(runs.getMostPerformant())}
    />
    <SingleRunView
        run={runs.getFurthest()}
        onClick={() => setCurrentRun(runs.getFurthest())}
    />
    <SingleRunView
        run={runs.getLongest()}
        onClick={() => setCurrentRun(runs.getLongest())}
    />
    <SingleRunView
        run={runs.getFastest()}
        onClick={() => setCurrentRun(runs.getFastest())}
    />
</div>;

export default BestRuns;
