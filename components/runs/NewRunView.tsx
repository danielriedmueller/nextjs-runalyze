import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import IEditRun from "../../interfaces/IEditRun";
import EditRun from "../../model/EditRun";

interface IProps {
    insert: (editRun: IEditRun) => void;
}

interface IState {
    run: IEditRun;
}

export default class NewRunView extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            run: EditRun.create()
        };

        this.props.insert(this.state.run);
    }

    onChange = (evt): void => {
        let run = this.state.run;
        run[evt.target.name] = evt.target.value;

        this.setState({run});

        this.props.insert(run);
    }

    render() {
        return <div>
            <div className={style.date}>
                <input
                    name="date"
                    value={this.state.run.date}
                    onChange={this.onChange}
                    type="datetime-local"
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
