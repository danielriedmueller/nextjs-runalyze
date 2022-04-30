import React, {Component} from "react";
import style from '../../style/multipleruns.module.scss';
import IRuns from "../../interfaces/IRuns";

interface IProps {
    runs: IRuns;
    label: string;
    active: boolean;
    onClick: () => void;
}

interface IState {
}

export default class MultipleRuns extends Component<IProps, IState> {
    render() {
        return <div onClick={() => this.props.onClick()}>
            <div className={this.props.active ? style.activeLegend : style.legend}>{this.props.label}</div>
            <div className={style.count}>{this.props.runs.getCount()}</div>
            <div className={style.pace}>{this.props.runs.getPaceAvg()}</div>
            <div
                className={style.distance}>{this.props.runs.renderDistanceSum()}<br/><small>{this.props.runs.renderDistanceAvg()}</small>
            </div>
            <div
                className={style.duration}>{this.props.runs.getDurationSum()}<br/><small>{this.props.runs.getDurationAvg()}</small>
            </div>
            <div className={style.vdot}>{this.props.runs.getVdotAvg()}</div>
        </div>;
    }
}
