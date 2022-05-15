import React, {FC, ReactElement, ReactNode, useState} from "react";
import style from '../../style/currentrun.module.scss';
import runStyle from '../../style/run.module.scss';
import IRun from "../../interfaces/IRun";

interface IProps {
    run: IRun;
}

const CurrentRunView: FC<IProps> = ({run}): ReactElement => {
    const [showHelp, setShowHelp] = useState<boolean>(false);

    const renderHelpContent = (run: IRun): ReactNode => <div
        className={run.best.length > 0 ? run.best.map((type) => runStyle[type]).join(" ") : ""}>
        <div className={style.head}>
            <div className={style.date}>
                <small>{run.getDateDay()}<br/>{run.getDate()}</small>
            </div>
        </div>
        <div className={style.stats}>
            <div className={runStyle.pace}>
                Pace in M/km
            </div>
            <div className={runStyle.distance}>
                Distanz in km
            </div>
            <div className={runStyle.duration}>
                Dauer
            </div>
            <div className={runStyle.vdot}>
                VDOT
            </div>
            <div className={runStyle.steps}>
                Schritte
            </div>
            <div className={runStyle.calories}>
                Kalorien
            </div>
        </div>
    </div>;

    return (<>
        <button className={style.help} onClick={() => setShowHelp(!showHelp)}></button>
        {!run ? <></> : showHelp ? renderHelpContent(run) :
            <div className={run.best.length > 0 ? run.best.map((type) => runStyle[type]).join(" ") : ""}>
                <div className={runStyle.date}>
                    <small>{run.getDateDay()}<br/>{run.getDate()}</small>
                </div>
                <div className={style.stats}>
                    <div className={runStyle.pace}>
                        <span className={style[run.paceTrend]}>{run.getPace()}</span>
                    </div>
                    <div className={runStyle.distance}>
                        <span className={style[run.distanceTrend]}>{run.renderDistance()}</span>
                    </div>
                    <div className={runStyle.duration}>
                        <span className={style[run.durationTrend]}>{run.getDuration()}</span>
                    </div>
                    <div className={runStyle.vdot}>
                        <span className={style[run.vdotTrend]}>{run.vdot}</span>
                    </div>
                    <div className={runStyle.steps}>
                        {run.steps}
                    </div>
                    <div className={runStyle.calories}>
                        {run.renderCalories()}
                    </div>
                </div>
            </div>}
    </>)
}

export default CurrentRunView;
