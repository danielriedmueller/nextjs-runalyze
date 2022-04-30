import React, {FC, ReactElement} from "react";
import style from '../../style/singlerun.module.scss';
import IRun from "../../interfaces/IRun";

interface IProps {
    run: IRun;
    best?: string;
}

const SingleRunView: FC<IProps> = ({run}): ReactElement => !run ? null : (
    <div className={(run.best.length > 0 ? run.best.map((type) => style[type]).join(" ") : "")}>
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
