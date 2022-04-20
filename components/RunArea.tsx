import React, {Component} from "react";
import IRun from "../interfaces/IRun";
import CurrentRunView from "./runs/CurrentRunView";
import IUser from "../interfaces/IUser";
import IEditRun from "../interfaces/IEditRun";
import {insertRun, updateRun} from "../helper/fetch";

interface IProps {
    runs: IRun[],
    user: IUser,
}

interface IState {
    currentRun: IRun
    statistics: string
}

export default class RunArea extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            currentRun: props.runs[0],
            statistics: 'vdot'
        };
    }

    upsert = async (run: IEditRun) => {
        if (run.id) {
            await updateRun(run);
        } else {
            await insertRun(run, this.props.user);
        }
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
