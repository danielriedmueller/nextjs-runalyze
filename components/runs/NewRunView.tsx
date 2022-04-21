import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import IEditRun from "../../interfaces/IEditRun";

interface IProps {
    run: IEditRun;
    insert: (editRun: IEditRun) => void;
}

interface IState {
}

export default class NewRunView extends Component<IProps, IState> {
    onChange = (evt): void => {
        let run = this.props.run;
        run[evt.target.name] = evt.target.value;

        this.props.insert(run);
    }

    render() {
        return <div>
            <div className={style.date}>
                <input
                    name="date"
                    value={this.props.run.date || ''}
                    onChange={this.onChange}
                    type="datetime-local"
                />
            </div>
            <div className={style.distance}>
                <input
                    name="distance"
                    value={this.props.run.distance || ''}
                    onChange={this.onChange}
                    type="text"
                />
            </div>
            <div className={style.duration}>
                <input
                    name="duration"
                    value={this.props.run.duration || ''}
                    onChange={this.onChange}
                    type="text"
                />
            </div>
        </div>
    }
}
