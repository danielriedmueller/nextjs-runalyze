import React, {FC, ReactElement} from "react";
import style from '../../style/multipleruns.module.scss';
import runStyle from '../../style/run.module.scss';
import IRuns from "../../interfaces/IRuns";
import ZeroRuns from "../../model/ZeroRuns";
import {ArithmeticModes} from "../../pages";

interface IProps {
    runs: IRuns;
    label: string;
    active: boolean;
    onClick: () => void;
    mode: ArithmeticModes;
}

const MultipleRunsView: FC<IProps> = ({runs, label, active, onClick, mode}): ReactElement => {
    const noRuns = runs instanceof ZeroRuns;

    if (noRuns) {
        return <div className={style.noruns}>
            <div className={runStyle.head}>
                <div className={active ? style.activeLegend : style.legend}>{label}</div>
                <div className={runStyle.count}>-</div>
            </div>
            <div className={runStyle.scrollable}>
                <div className={runStyle.vdot + " " + (mode === ArithmeticModes.Sum ? runStyle.disabled : "")}>-</div>
                <div className={runStyle.pace + " " + (mode === ArithmeticModes.Sum ? runStyle.disabled : "")}>-</div>
                <div className={runStyle.distance}>-</div>
                <div className={runStyle.duration}>-</div>
                <div className={runStyle.steps}>-</div>
                <div className={runStyle.calories}>-</div>
            </div>
        </div>;
    }

    return <div onClick={() => noRuns ? () => {} : onClick()}>
        <div className={runStyle.head}>
            <div className={active ? style.activeLegend : style.legend}>{label}</div>
            <div className={runStyle.count}>{runs.getCount()}</div>
        </div>
        <div className={runStyle.scrollable}>
            <div className={runStyle.vdot + " " + (mode === ArithmeticModes.Sum ? runStyle.disabled : "")}>{
                mode === ArithmeticModes.Sum
                    ? runs.getVdotAvg()
                    : mode === ArithmeticModes.Avg ? runs.getVdotAvg()
                        : runs.getVdotMed()
            }</div>
            <div className={runStyle.pace + " " + (mode === ArithmeticModes.Sum ? runStyle.disabled : "")}>{
                mode === ArithmeticModes.Sum
                    ? runs.getPaceAvg()
                    : mode === ArithmeticModes.Avg ? runs.getPaceAvg()
                        : runs.getPaceMed()
            }</div>
            <div className={runStyle.distance}>{
                mode === ArithmeticModes.Sum
                ? runs.renderDistanceSum()
                : mode === ArithmeticModes.Avg ? runs.renderDistanceAvg()
                    : runs.renderDistanceMed()}
            </div>
            <div className={runStyle.duration}>{
                mode === ArithmeticModes.Sum
                ? runs.getDurationSum()
                : mode === ArithmeticModes.Avg ? runs.getDurationAvg()
                    : runs.getDurationMed()
            }</div>
            <div className={runStyle.steps}>{
                mode === ArithmeticModes.Sum
                    ? runs.getStepsSum()
                    : mode === ArithmeticModes.Avg ? runs.getStepsAvg()
                        : runs.getStepsMed()
            }</div>
            <div className={runStyle.calories}>{
                mode === ArithmeticModes.Sum
                    ? runs.getCaloriesSum()
                    : mode === ArithmeticModes.Avg ? runs.getCaloriesAvg()
                        : runs.getCaloriesMed()
            }</div>
        </div>
    </div>;
}

export default MultipleRunsView;
