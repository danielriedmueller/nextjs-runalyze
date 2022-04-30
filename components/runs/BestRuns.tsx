import React, {Component} from "react";
import style from '../../style/runs.module.scss';
import SingleRunView from "./SingleRunView";
import IRuns from "../../interfaces/IRuns";

interface IProps {
    runs: IRuns;
}

interface IState {
}

export default class BestRuns extends Component<IProps, IState> {
    render() {
        return <div className={style.table}>
            <SingleRunView
                run={this.props.runs.getMostPerformant()}
            />
            <SingleRunView
                run={this.props.runs.getFurthest()}
            />
            <SingleRunView
                run={this.props.runs.getLongest()}
            />
            <SingleRunView
                run={this.props.runs.getFastest()}
            />
        </div>;
    }
}
