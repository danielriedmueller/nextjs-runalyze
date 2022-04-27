import React, {Component, ReactNode} from "react";
import style from '../../style/runs.module.scss';
import SingleRunView from "./SingleRunView";
import IRuns from "../../interfaces/IRuns";
import IRun from "../../interfaces/IRun";

interface IProps {
    runs: IRuns;
    statistics: string;
    setStatistics: (currentRun: IRun, statistics: string) => void;
}

interface IState {
    statistics: string;
}

export default class SingleRuns extends Component<IProps, IState> {
    getRunViews(): ReactNode[] {
        if (this.props.runs.getCount() === 0) return [];

        return this.props.runs.toArray().map((run, index) => {
            return <div
                key={'singleRun-' + index}
            ><SingleRunView
                run={run}
                statistics={this.props.statistics}
                setStatistics={this.props.setStatistics}
            /></div>
        })
    }

    render() {
        return <div className={style.table}>{this.getRunViews()}</div>;
    }
}
