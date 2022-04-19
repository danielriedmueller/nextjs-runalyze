import React, {Component} from "react";
import {IRun} from "../interfaces/IRun";
import CurrentRun from "./runs/CurrentRun";

interface IProps {
    props: {
        runs: IRun[]
    }
}

interface IState {
    currentRun: IRun
    statistics: string
}

class RunArea extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            currentRun: props.runs[0],
            statistics: 'vdot'
        };
    }

    render() {
        return <>
            <CurrentRun
                run={this.state.currentRun}
                statistics={this.state.statistics}
            />
        </>
    }
}

export default RunArea;
