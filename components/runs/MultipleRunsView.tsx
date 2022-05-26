import React, {FC, ReactElement} from "react";
import style from '../../style/multipleruns.module.scss';
import runStyle from '../../style/run.module.scss';
import IRuns from "../../interfaces/IRuns";
import ZeroRuns from "../../model/ZeroRuns";

interface IProps {
    runs: IRuns;
    label: string;
    active: boolean;
    onClick: () => void;
}

const MultipleRunsView: FC<IProps> = ({runs, label, active, onClick}): ReactElement => {
    const noRuns = runs instanceof ZeroRuns;

    return <div className={noRuns ? style.noruns : ""} onClick={() => noRuns ? () => {} : onClick()}>
        <div className={runStyle.head}>
            <div className={active ? style.activeLegend : style.legend}>{label}</div>
            <div className={runStyle.count}>{runs.getCount()}</div>
        </div>
        <div className={runStyle.scrollable}>
            <div className={runStyle.pace}>{runs.getPaceAvg()}</div>
            <div
                className={runStyle.distance}>{runs.renderDistanceSum()}<br/><small>{runs.renderDistanceAvg()}</small>
            </div>
            <div
                className={runStyle.duration}>{runs.getDurationSum()}<br/><small>{runs.getDurationAvg()}</small>
            </div>
            <div className={runStyle.vdot}>{runs.getVdotAvg()}</div>
            <div className={runStyle.steps}>
                {runs.getStepsSum()}<br/><small>{runs.getStepsAvg()}</small>
            </div>
            <div className={runStyle.calories}>
                {runs.getCaloriesSum()}<br/><small>{runs.getCaloriesAvg()}</small>
            </div>
        </div>
    </div>;
}

export default MultipleRunsView;
