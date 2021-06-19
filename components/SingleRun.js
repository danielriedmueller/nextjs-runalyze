import React, {Component} from "react";
import style from '../style/singlerun.module.scss';
import {calcPace, durationToString} from "../helper/functions";
import { useLongPress } from 'use-long-press';

export function SingleRun(props) {
    if (!props.run) {
        return <div>
            {props.label ? <div className={style.legend}>{props.label}</div> : null}
            <div className={style.date}>-</div>
            <div className={style.pace}>-</div>
            <div className={style.distance}>-</div>
            <div className={style.duration}>-</div>
        </div>;
    }

    if (props.activateEditMode) {

    }
    const bind = useLongPress(() => {
        if (props.activateEditMode) {
            props.activateEditMode();
        }
    });

    return <div {...bind} className={props.activeClass ? style[props.activeClass] : ""}>
        {props.label ? <div className={style.legend}>{props.label}</div> : null}
        <div className={style.date} onClick={() => props.changeCurrentRun(props.run)}>
            <small>{props.run.date.format('dddd')}<br/>{props.run.date.format('YYYY-MM-DD HH:mm:ss')}</small>
        </div>
        <div className={style.pace} onClick={() => props.changeCurrentRun(props.run, 'pace')}>
            {calcPace(props.run.distance, props.run.duration)}
        </div>
        <div className={style.distance} onClick={() => props.changeCurrentRun(props.run, 'distance')}>
            {props.run.distance}
        </div>
        <div className={style.duration} onClick={() => props.changeCurrentRun(props.run, 'duration')}>
            {durationToString(props.run.duration)}
        </div>
        <div className={style.vdot}>
            {props.run.vdot}
        </div>
    </div>
}
