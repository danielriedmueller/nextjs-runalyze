import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import {useLongPress} from 'use-long-press';
import IRun from "../../interfaces/IRun";
import {calcPace, dateToDay, stringToDuration} from "../../helper/functions";

interface IProps {
    run: IRun
    activateEditMode: () => void,
    statistics: string,
    setStatistics: (statistics: string) => void,
    label?: string
}

interface IState {
    run: IRun
    activateEditMode: () => void,
    statistics: string,
    setStatistics: (statistics: string) => void,
    label?: string
}

export default class SingleRunView extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            run: props.run,
            activateEditMode: props.activateEditMode,
            statistics: props.statistics,
            setStatistics: props.setStatistics,
            label: props.label
        };
    }

    bind = useLongPress(() => this.state.activateEditMode());

    render() {
        const activeClass = this.state.statistics + 'Active';
        return <div {...this.bind} className={style[activeClass]}>
            {this.state.label ? <div className={style.legend}>{this.state.label}</div> : null}
            <div className={style.date} onClick={() => this.state.setStatistics('date')}>
                <small>{dateToDay(this.state.run.date)}<br/>{this.state.run.date}</small>
            </div>
            <div className={style.pace} onClick={() => this.state.setStatistics('pace')}>
                {calcPace(this.state.run.distance, stringToDuration(this.state.run.duration))}
            </div>
            <div className={style.distance} onClick={() => this.state.setStatistics('distance')}>
                {this.state.run.distance}
            </div>
            <div className={style.duration} onClick={() => this.state.setStatistics('duration')}>
                {this.state.run.duration}
            </div>
            <div className={style.vdot} onClick={() => this.state.setStatistics('vdot')}>
                {this.state.run.vdot}
            </div>
        </div>
    }
}