import React, {Component} from "react";
import IRun from "../interfaces/IRun";
import CurrentRunView from "./runs/CurrentRunView";
import IUser from "../interfaces/IUser";
import IEditRun from "../interfaces/IEditRun";
import {insertRun, updateRun} from "../helper/fetch";

interface IProps {
    runs: IRun[],
    user: IUser,
    refresh: () => void
}

interface IState {
    statistics: string
}

export default class RunArea extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
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

    setStatistics = (statistics: string) => {
        this.setState({statistics});
    }

    render() {
        return <>
            <CurrentRunView
                run={this.props.runs[0]}
                statistics={this.state.statistics}
                setStatistics={this.setStatistics}
                upsert={this.upsert}
                user={this.props.user}
            />
        </>
    }
}
