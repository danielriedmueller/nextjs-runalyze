import React from "react";
import style from '../style/singlerun.module.scss';

export function EditRun(props) {
    return <div>
        <div className={style.date}>
            <input
                name="date"
                value={props.editRun.date}
                onChange={props.onChange}
                type="date"
            />
            <input
                name="date"
                value={props.editRun.time}
                onChange={props.onChange}
                type="time"
            />
        </div>
        <div className={style.distance}>
            <input
                name="distance"
                value={props.editRun.distance}
                onChange={props.onChange}
                type="text"
            />
        </div>
        <div className={style.duration}>
            <input
                name="duration"
                value={props.editRun.duration}
                onChange={props.onChange}
                type="text"
            />
        </div>
    </div>
}