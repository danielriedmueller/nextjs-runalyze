import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import {EditRun} from "../../model/EditRun";
import IRun from "../../interfaces/IRun";
import IEditRun from "../../interfaces/IEditRun";

interface IProps {
    run: IRun
    upsert: (editRun: IEditRun) => void
}

interface IState {
    run: IEditRun
    upsert: (editRun: IEditRun) => void
}

export default class EditRunView extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            run: EditRun.fromRun(props.run),
            upsert: props.updateOrInsertRun
        };
    }

    onChange = (evt): void => {
        let run = this.state.run;
        run[evt.target.name] = evt.target.value;

        this.setState({run});

        this.state.upsert(run);
    }

    render() {
        return <div>
            <div className={style.date}>
                <input
                    name="date"
                    value={this.state.run.date}
                    onChange={this.onChange}
                    type="date"
                />
                <input
                    name="date"
                    value={this.state.run.time}
                    onChange={this.onChange}
                    type="time"
                />
            </div>
            <div className={style.distance}>
                <input
                    name="distance"
                    value={this.state.run.distance}
                    onChange={this.onChange}
                    type="text"
                />
            </div>
            <div className={style.duration}>
                <input
                    name="duration"
                    value={this.state.run.duration}
                    onChange={this.onChange}
                    type="text"
                />
            </div>
        </div>
    }
}