import React, {FC, ReactElement} from "react";
import style from '../../style/multipleruns.module.scss';
import IRuns from "../../interfaces/IRuns";

interface IProps {
    runs: IRuns;
    label: string;
    active: boolean;
    onClick: () => void;
}

const MultipleRunsView: FC<IProps> = ({runs, label, active, onClick}): ReactElement => {
    return <div onClick={() => onClick()}>
        <div className={active ? style.activeLegend : style.legend}>{label}</div>
        <div className={style.count}>{runs.getCount()}</div>
        <div className={style.scrollable}>
            <div className={style.pace}>{runs.getPaceAvg()}</div>
            <div
                className={style.distance}>{runs.renderDistanceSum()}<br/><small>{runs.renderDistanceAvg()}</small>
            </div>
            <div
                className={style.duration}>{runs.getDurationSum()}<br/><small>{runs.getDurationAvg()}</small>
            </div>
            <div className={style.vdot}>{runs.getVdotAvg()}</div>
            <div className={style.steps}>
                {runs.getStepsSum()}<br/><small>{runs.getStepsAvg()}</small>
            </div>
            <div className={style.calories}>
                {runs.getCaloriesSum()}<br/><small>{runs.getCaloriesAvg()}</small>
            </div>
        </div>
    </div>;
}

export default MultipleRunsView;
