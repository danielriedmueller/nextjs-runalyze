import React, {Component} from "react";
import {findFastestRun, findFurthestRun, findLongestRun, findPerformanceRun} from "../../helper/functions";
import style from '../../style/runs.module.scss';
import {SingleRun} from "../SingleRun";

export default class BestRuns extends Component {
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
            <SingleRun
                label={"Performance"}
                run={performanceRun}
                changeCurrentRun={this.props.changeCurrentRun}
                activeClass={this.getIsActiveClass(performanceRun)}
            />
            <SingleRun
                label={"Weitester"}
                run={furthestRun}
                changeCurrentRun={this.props.changeCurrentRun}
                activeClass={this.getIsActiveClass(furthestRun)}
            />
            <SingleRun
                label={"Längster"}
                run={longestRun}
                changeCurrentRun={this.props.changeCurrentRun}
                activeClass={this.getIsActiveClass(longestRun)}
            />
            <SingleRun
                label={"Schnellster"}
                run={fastestRun}
                changeCurrentRun={this.props.changeCurrentRun}
                activeClass={this.getIsActiveClass(fastestRun)}
            />
        </div>;
    }
}