import React, {Component} from "react";
import style from '../../style/runs.module.scss';

export default class DateRuns extends Component {
    getRuns() {
        return [];
    }
    
    render() {
        return <div className={style.table}>{this.getRuns()}</div>;
    }
}