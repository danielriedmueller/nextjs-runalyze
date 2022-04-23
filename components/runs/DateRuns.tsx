import React, {Component, ReactNode} from "react";
import style from '../../style/runs.module.scss';
import IRuns, {IDateFilter} from "../../interfaces/IRuns";

interface IProps {
    runs: IRuns;
    setDateFilter: (filter: IDateFilter) => void;
}

interface IState {
}

export default class DateRuns extends Component<IProps, IState> {
    getRunViews(): ReactNode[] {
        return [];
    }

    render() {
        return <div className={style.table}>{this.getRunViews()}</div>;
    }
}
