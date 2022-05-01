import React, {FC, ReactElement} from "react";
import style from '../../style/singlerun.module.scss';
import IRun from "../../interfaces/IRun";

interface IProps {
    run: IRun;
    onClick?: () => void;
}

const SingleRunView: FC<IProps> = ({run, onClick}): ReactElement => !run ? null : (
    <div
        className={style[run.isCurrent ? 'isCurrent' : ''] + " " + (run.best.length > 0 ? run.best.map((type) => style[type]).join(" ") : "")}
        onClick={onClick}
    >
        <div className={style.date}>
            <small>{run.getDateDay()}<br/>{run.getDate()}</small>
        </div>
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
    </div>
);

export default SingleRunView;
