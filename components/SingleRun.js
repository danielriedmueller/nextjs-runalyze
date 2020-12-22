import React, {Component} from "react";
import style from '../style/singlerun.module.scss';
import {calcPace, durationToString} from "../helper/functions";

export default class SingleRun extends Component {
    constructor(props) {
        super(props);

        this.changeCurrentRun = this.changeCurrentRun.bind(this);
    }

    changeCurrentRun(run, graphMode) {
        this.props.changeCurrentRun(run, graphMode);
    }

    render() {
        if (!this.props.run) {
            return <div>
                <div className={style.legend}>{this.props.label}</div>
                <div className={style.date}>-</div>
                <div className={style.pace}>-</div>
                <div className={style.distance}>-</div>
                <div className={style.duration}>-</div>
            </div>;
        }

        return <div className={this.props.activeClass ? style[this.props.activeClass] : ""}>
            {this.props.label ? <div className={style.legend}>{this.props.label}</div> : null}
            <div className={style.date} onClick={() => this.changeCurrentRun(this.props.run)}>
                {this.props.run.date.format('dddd')}<br/><small>{this.props.run.date.format('YYYY-MM-DD HH:mm:ss')}</small>
            </div>
            <div className={style.pace} onClick={() => this.changeCurrentRun(this.props.run, 'pace')}>
                {calcPace(this.props.run.distance, this.props.run.duration)}
            </div>
            <div className={style.distance} onClick={() => this.changeCurrentRun(this.props.run, 'distance')}>
                {this.props.run.distance}
            </div>
            <div className={style.duration} onClick={() => this.changeCurrentRun(this.props.run, 'duration')}>
                {durationToString(this.props.run.duration)}
            </div>
        </div>;
    }
}