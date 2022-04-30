import React, {Component} from "react";
import IRun from "../interfaces/IRun";
import IUser from "../interfaces/IUser";
import IEditRun from "../interfaces/IEditRun";
import {deleteRun, insertRun, updateRun} from "../helper/fetch";
import BestRuns from "./runs/BestRuns";
import style from '../style/runarea.module.scss';
import IRuns from "../interfaces/IRuns";
import YearRuns from "./runs/YearRuns";
import MonthRuns from "./runs/MonthRuns";
import WeekRuns from "./runs/WeekRuns";
import IDateFilter from "../interfaces/IDateFilter";
import SingleRuns from "./runs/SingleRuns";
import EditArea, {Mode} from "./runs/EditArea";
import EditRun from "../model/EditRun";
import EditRunView from "./runs/EditRunView";
import NewRunView from "./runs/NewRunView";
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
    editRun: IEditRun;
    statistics: string;
    mode: number;
}

export default class RunArea extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            currentRun: null,
            editRun: null,
            statistics: 'vdot',
            mode: Mode.None
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (!state.currentRun) {
            return {currentRun: props.runs.getFiltered(props.filter).getLatest()};
        }

        return null;
    }

    upsert = async (run: IEditRun) => {
        if (run.id) {
            await updateRun(run);
        } else {
            await insertRun(run, this.props.user);
        }

        this.props.refresh();
    }

    onChangeConfirm = async (): Promise<void> => {
        if (!this.state.editRun) {
            return;
        }

        if (this.state.editRun.isValid()) {
            await this.upsert(this.state.editRun);
            this.setMode(Mode.None);
        }
    }

    onDelete = async (): Promise<void> => {
        this.setMode(Mode.None)
        await deleteRun(this.state.currentRun);
        await this.props.refresh();
        this.setState({currentRun: null});
    }

    setMode = (mode: number) => {
        let editRun = null;

        if (mode === Mode.Insert) {
            editRun = EditRun.create();
        }

        if (mode === Mode.Edit) {
            editRun = EditRun.fromRun(this.state.currentRun);
        }

        this.setState({
            mode,
            editRun
        });
    }

    setStatistics = (currentRun: IRun, statistics: string) => {
        this.setState({currentRun, statistics});
    }

    render() {
        return <>
            <EditArea
                mode={this.state.mode}
                onChangeConfirm={this.onChangeConfirm}
                onDelete={this.onDelete}
                setMode={this.setMode}
            />
            <div className={style.currentRun}>
                {this.state.mode === Mode.Edit ? <EditRunView
                    run={this.state.editRun}
                    update={this.upsert}
                /> : this.state.mode === Mode.Insert ? <NewRunView
                    run={this.state.editRun}
                    insert={this.upsert}
                /> : <CurrentRunView
                    run={this.state.currentRun}
                    statistics={this.state.statistics}
                    setStatistics={this.setStatistics}
                />}
            </div>
            <div className={style.runarea}>
                <BestRuns
                    runs={this.props.runs.getFiltered(this.props.filter)}
                    statistics={this.state.statistics}
                    setStatistics={this.setStatistics}
                />
                <SingleRuns
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
