import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import IRun from "../../interfaces/IRun";

interface IProps {
    run: IRun;
    statistics: string;
    setStatistics: (statistics: string) => void;
    label?: string;
}

interface IState {
}

export default class SingleRunView extends Component<IProps, IState> {
    render() {
        const activeClass = this.props.statistics + 'Active';
        const run = this.props.run;
        return <div className={style[activeClass]}>
            {this.props.label ? <div className={style.legend}>{this.props.label}</div> : null}
            <div className={style.date} onClick={() => this.props.setStatistics('date')}>
                <small>{run.getDateDay()}<br/>{run.date}</small>
            </div>
            <div className={style.pace} onClick={() => this.props.setStatistics('pace')}>
                {run.getPace()}
            </div>
            <div className={style.distance} onClick={() => this.props.setStatistics('distance')}>
                {run.distance}
            </div>
            <div className={style.duration} onClick={() => this.props.setStatistics('duration')}>
                {run.getDuration()}
            </div>
            <div className={style.vdot} onClick={() => this.props.setStatistics('vdot')}>
                {run.vdot}
            </div>
        </div>
    }
}
