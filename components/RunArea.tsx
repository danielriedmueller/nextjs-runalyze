import React, {Component} from "react";
import IRun from "../interfaces/IRun";
import CurrentRunView from "./runs/CurrentRunView";
import IUser from "../interfaces/IUser";
import IEditRun from "../interfaces/IEditRun";
import {insertRun, updateRun} from "../helper/fetch";
import BestRuns from "./runs/BestRuns";
import style from '../style/runarea.module.scss';

interface IProps {
    runs: IRun[];
    user: IUser;
    refresh: () => void;
}

interface IState {
    currentRun: IRun;
    statistics: string;
}

export default class RunArea extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            currentRun: null,
            statistics: 'vdot'
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {
            currentRun: props.runs[0]
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

    setStatistics = (statistics: string) => {
        this.setState({statistics});
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
        </>
    }
}
