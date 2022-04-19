import React, {Component} from "react";
import style from '../style/multipleruns.module.scss';
import {calcPace, durationToString} from "../helper/functions";

export default class MultipleRuns extends Component {
    render() {
        if (!this.props.run) {
            return <div>
                <div className={this.props.isActive ? style.activeLegend : style.legend}>{this.props.label}</div>
                <div className={style.count}>0</div>
                <div className={style.pace}>-</div>
                <div className={style.distance}>-</div>
                <div className={style.duration}>-</div>
                <div className={style.vdot}>-</div>
            </div>;
        }

        return <div>
            <div className={this.props.isActive ? style.activeLegend : style.legend}>{this.props.label}</div>
            <div className={style.count}>{this.props.run.runs ?? 1}</div>
            <div className={style.pace}>{calcPace(this.props.run.distance, this.props.run.duration)}</div>
            <div className={style.distance}>{this.props.run.distance}<br /><small>{this.props.run.avgDistance}</small></div>
            <div className={style.duration}>{durationToString(this.props.run.duration)}<br /><small>{durationToString(this.props.run.avgDuration)}</small></div>
            <div className={style.vdot}>{this.props.run.avgVdot}</div>
        </div>;
    }
}
