import React, {FC, ReactElement} from "react";
import style from '../../style/run.module.scss';
import IRun from "../../interfaces/IRun";

interface IProps {
    run: IRun;
    onClick?: () => void;
}

const SingleRunView: FC<IProps> = ({run, onClick}): ReactElement => run && (
    <div
        className={style[run.isCurrent ? 'isCurrent' : ''] + " " + (run.isBestInSomething() ? run.best.map((type) => style[type]).join(" ") : "")}
        onClick={onClick}
    >
        <div className={style.head}>
            <div className={style.date}>
                <small>{run.getDateDay()}<br/>{run.getDate()}</small>
            </div>
        </div>
        <div className={style.scrollable}>
            <div className={style.pace}>
                {run.getPace()}
            </div>
            <div className={style.distance}>
                {run.renderDistance()}
            </div>
            <div className={style.duration}>
                {run.getDuration()}
            </div>
            <div className={style.vdot}>
                {run.vdot}
            </div>
            <div className={style.steps}>
                {run.steps}
            </div>
            <div className={style.calories}>
                {run.renderCalories()}
            </div>
        </div>
    </div>
);

export default SingleRunView;
