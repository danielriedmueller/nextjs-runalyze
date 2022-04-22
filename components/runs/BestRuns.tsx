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
                label={"Performance"}
                run={this.props.runs.getMostPerformant()}
                statistics={this.props.statistics}
                setStatistics={this.props.setStatistics}
            />
            <SingleRunView
                label={"Weitester"}
                run={this.props.runs.getFurthest()}
                statistics={this.props.statistics}
                setStatistics={this.props.setStatistics}
            />
            <SingleRunView
                label={"Längster"}
                run={this.props.runs.getLongest()}
                statistics={this.props.statistics}
                setStatistics={this.props.setStatistics}
            />
            <SingleRunView
                label={"Schnellster"}
                run={this.props.runs.getFastest()}
                statistics={this.props.statistics}
                setStatistics={this.props.setStatistics}
            />
        </div>;
    }
}