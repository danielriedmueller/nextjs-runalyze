import React, {Component} from "react";
import style from '../style/newrun.module.scss';
import {isValidRun} from "../helper/functions";

export default class NewRun extends Component {
    render() {
        return <div className={style.newRun}>
            <label>
                <input
                    name="distanceInput"
                    value={this.props.newRun.distance || 0.0}
                    onChange={this.props.onChange}
                    type="number"
                    placeholder={"0.0"}
                />
            </label>
            <label>
                <input
                    name="durationInput"
                    value={this.props.newRun.duration || ""}
                    onChange={this.props.onChange}
                    type="text"
                    placeholder={"00:00"}
                />
            </label>
            {isValidRun(this.props.newRun) ? <button onClick={() => {
                this.props.onInsert(this.props.newRun)
            }} /> : null}
        </div>;
    }
}