import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import IRun from "../../interfaces/IRun";

interface IProps {
    run: IRun;
    statistics: string;
    setStatistics: (currentRun: IRun, statistics: string) => void;
    best?: string;
}

interface IState {
}

export default class SingleRunView extends Component<IProps, IState> {
    render() {
        const activeClass = this.props.statistics + 'Active';
        const run = this.props.run;

        return <div className={style[activeClass] + ' ' + (run.best.length > 0 ? run.best.map((type) => style[type]).join(" ") : "")}>
            <div className={style.date} onClick={() => this.props.setStatistics(run, 'date')}>
                <small>{run.getDateDay()}<br/>{run.getDate()}</small>
            </div>
            <div className={style.pace} onClick={() => this.props.setStatistics(run, 'pace')}>
                {run.getPace()}
            </div>
            <div className={style.distance} onClick={() => this.props.setStatistics(run, 'distance')}>
                {run.renderDistance()}
            </div>
            <div className={style.duration} onClick={() => this.props.setStatistics(run, 'duration')}>
                {run.getDuration()}
            </div>
            <div className={style.vdot} onClick={() => this.props.setStatistics(run, 'vdot')}>
                {run.vdot}
            </div>
        </div>
    }
}
