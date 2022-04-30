import React, {FC, ReactElement} from "react";
import style from '../../style/runs.module.scss';
import SingleRunView from "./SingleRunView";
import IRuns from "../../interfaces/IRuns";

interface IProps {
    runs: IRuns;
}

const BestRuns: FC<IProps> = ({runs}): ReactElement => {
    return <div className={style.table}>
        <SingleRunView
            run={runs.getMostPerformant()}
        />
        <SingleRunView
            run={runs.getFurthest()}
        />
        <SingleRunView
            run={runs.getLongest()}
        />
        <SingleRunView
            run={runs.getFastest()}
        />
    </div>;
}

export default BestRuns;
