import React, {Component, ReactNode} from "react";
import style from '../../style/runs.module.scss';
import SingleRunView from "./SingleRunView";
import IRuns from "../../interfaces/IRuns";

interface IProps {
    runs: IRuns;
}

interface IState {
}

export default class SingleRuns extends Component<IProps, IState> {
    getRunViews(): ReactNode[] {
        if (this.props.runs.getCount() === 0) return [];

        return this.props.runs.toArray().map((run, index) => {
            return <div
                key={'singleRun-' + index}
            ><SingleRunView
                run={run}
            /></div>
        })
    }

    render() {
        return <div className={style.table}>{this.getRunViews()}</div>;
    }
}
