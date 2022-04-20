import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import {useLongPress} from 'use-long-press';
import IRun from "../../interfaces/IRun";

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

    bind = () => useLongPress(() => this.state.activateEditMode());

    render() {
        const activeClass = this.props.statistics + 'Active';
        const run = this.state.run;
        return <div {...this.bind} className={style[activeClass]}>
            {this.state.label ? <div className={style.legend}>{this.state.label}</div> : null}
            <div className={style.date} onClick={() => this.state.setStatistics('date')}>
                <small>{run.getDateDay()}<br/>{run.date}</small>
            </div>
            <div className={style.pace} onClick={() => this.state.setStatistics('pace')}>
                {run.getPace()}
            </div>
            <div className={style.distance} onClick={() => this.state.setStatistics('distance')}>
                {run.distance}
            </div>
            <div className={style.duration} onClick={() => this.state.setStatistics('duration')}>
                {run.getDuration()}
            </div>
            <div className={style.vdot} onClick={() => this.state.setStatistics('vdot')}>
                {run.vdot}
            </div>
        </div>
    }
}