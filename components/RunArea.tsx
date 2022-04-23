import React, {Component} from "react";
import IRun from "../interfaces/IRun";
import CurrentRunView from "./runs/CurrentRunView";
import IUser from "../interfaces/IUser";
import IEditRun from "../interfaces/IEditRun";
import {insertRun, updateRun} from "../helper/fetch";
import BestRuns from "./runs/BestRuns";
import style from '../style/runarea.module.scss';
import IRuns from "../interfaces/IRuns";
import YearRuns from "./runs/YearRuns";
import MonthRuns from "./runs/MonthRuns";
import WeekRuns from "./runs/WeekRuns";
import IDateFilter from "../interfaces/IDateFilter";

interface IProps {
    runs: IRuns;
    user: IUser;
    refresh: () => void;
    filter: IDateFilter;
    setDateFilter: (filter: IDateFilter) => void;
}

interface IState {
    currentRun: IRun;
    statistics: string;
}

export default class RunArea extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            currentRun: props.runs.getLatest(),
            statistics: 'vdot'
        };
    }

    upsert = async (run: IEditRun) => {
        if (run.id) {
            await updateRun(run);
        } else {
            await insertRun(run, this.props.user);
        }

        this.props.refresh();
    }

    setStatistics = (currentRun: IRun, statistics: string) => {
        this.setState({currentRun, statistics});
    }

    render() {
        return <>
            <CurrentRunView
                run={this.state.currentRun}
                statistics={this.state.statistics}
                setStatistics={this.setStatistics}
                upsert={this.upsert}
                user={this.props.user}
            />
            <div className={style.runarea}>
                <BestRuns
                    runs={this.props.runs.getFiltered(this.props.filter)}
                    statistics={this.state.statistics}
                    setStatistics={this.setStatistics}
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
