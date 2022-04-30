import React, {Component} from "react";
import IRun from "../interfaces/IRun";
import IUser from "../interfaces/IUser";
import BestRuns from "./runs/BestRuns";
import style from '../style/runarea.module.scss';
import IRuns from "../interfaces/IRuns";
import YearRuns from "./runs/YearRuns";
import MonthRuns from "./runs/MonthRuns";
import WeekRuns from "./runs/WeekRuns";
import IDateFilter from "../interfaces/IDateFilter";
import SingleRuns from "./runs/SingleRuns";
import CurrentRunView from "./runs/CurrentRunView";

interface IProps {
    runs: IRuns;
    user: IUser;
    refresh: () => void;
    filter: IDateFilter;
    setDateFilter: (filter: IDateFilter) => void;
}

interface IState {
    currentRun: IRun;
}

export default class RunArea extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            currentRun: props.runs.getFiltered(props.filter).getNewest()
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.currentRun) {
            return {currentRun: props.runs.getLatest()};
        }

        return null;
    }

    render() {
        return <>
            <div className={style.currentRun}>
                <CurrentRunView
                    run={this.state.currentRun}
                />
            </div>
            <div className={style.runarea}>
                <BestRuns
                    runs={this.props.runs.getFiltered(this.props.filter)}
                />
                <SingleRuns
                    runs={this.props.runs.getFiltered(this.props.filter)}
                />
                <WeekRuns
                    runs={this.props.runs.getFiltered(this.props.filter, 'month')}
                    filter={this.props.filter}
                    setDateFilter={this.props.setDateFilter}
                />
                <MonthRuns
                    runs={this.props.runs.getFiltered(this.props.filter, 'year')}
                    filter={this.props.filter}
                    setDateFilter={this.props.setDateFilter}
                />
                <YearRuns
                    runs={this.props.runs}
                    filter={this.props.filter}
                    setDateFilter={this.props.setDateFilter}
                />
            </div>
        </>
    }
}
