import React, {Component} from "react";
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

export default class BestRuns extends Component<IProps, IState> {
    render() {
        return <div className={style.table}>
            <SingleRunView
                run={this.props.runs.getFurthest()}
                statistics={this.props.statistics}
                setStatistics={this.props.setStatistics}
            />
            <SingleRunView
                run={this.props.runs.getLongest()}
                statistics={this.props.statistics}
                setStatistics={this.props.setStatistics}
            />
            <SingleRunView
                run={this.props.runs.getFastest()}
                statistics={this.props.statistics}
                setStatistics={this.props.setStatistics}
            />
        </div>;
    }
}
