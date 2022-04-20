import React, {Component} from "react";
import IRun from "../interfaces/IRun";
import CurrentRunView from "./runs/CurrentRunView";

interface IProps {
    runs: IRun[]
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

    setStatistics = (statistics: string) => {
        this.setState({statistics});
    }

    render() {
        return <>
            <CurrentRunView
                run={this.state.currentRun}
                statistics={this.state.statistics}
                setStatistics={this.setStatistics}
            />
        </>
    }
}