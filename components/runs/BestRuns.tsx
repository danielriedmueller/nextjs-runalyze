import React, {Component} from "react";
import {findFastestRun, findFurthestRun, findLongestRun, findPerformanceRun} from "../../helper/functions";
import style from '../../style/runs.module.scss';
import IRun from "../../interfaces/IRun";
import IUser from "../../interfaces/IUser";
import SingleRunView from "./SingleRunView";

interface IProps {
    runs: IRun[];
    user: IUser;
    refresh: () => void;
}

interface IState {
    statistics: string;
}

export default class BestRuns extends Component<IProps, IState> {
    getIsActiveClass(run) {
        if (run && run.date.isSame(this.props.currentRun.date)) {
            return this.props.graphMode + 'Active'
        }

        return null;
    }
    
    render() {
        const runCount = this.props.runs.length;
        const performanceRun = runCount > 0 ? findPerformanceRun(this.props.runs) : null;
        const furthestRun = runCount > 0 ? findFurthestRun(this.props.runs) : null;
        const longestRun = runCount > 0 ? findLongestRun(this.props.runs) : null;
        const fastestRun = runCount > 0 ? findFastestRun(this.props.runs) : null;

        return <div className={style.table}>
            <SingleRunView
                label={"Performance"}
                run={performanceRun}
                changeCurrentRun={this.props.changeCurrentRun}
                activeClass={this.getIsActiveClass(performanceRun)}
            />
            <SingleRunView
                label={"Weitester"}
                run={furthestRun}
                changeCurrentRun={this.props.changeCurrentRun}
                activeClass={this.getIsActiveClass(furthestRun)}
            />
            <SingleRunView
                label={"Längster"}
                run={longestRun}
                changeCurrentRun={this.props.changeCurrentRun}
                activeClass={this.getIsActiveClass(longestRun)}
            />
            <SingleRunView
                label={"Schnellster"}
                run={fastestRun}
                changeCurrentRun={this.props.changeCurrentRun}
                activeClass={this.getIsActiveClass(fastestRun)}
            />
        </div>;
    }
}