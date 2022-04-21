import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import IRun from "../../interfaces/IRun";
import IEditRun from "../../interfaces/IEditRun";
import EditRun from "../../model/EditRun";

interface IProps {
    run: IRun;
    update: (editRun: IEditRun) => void;
}

interface IState {
    run: IEditRun;
}

export default class EditRunView extends Component<IProps, IState> {
    static getDerivedStateFromProps(props, state) {
        console.log('editrunview: ', props.run.date);
        const editRun = EditRun.fromRun(props.run);
        console.log('editrunview: ', editRun.date);
        return {
            run: editRun
        };
    }

    onChange = (evt): void => {
        let run = this.state.run;
        run[evt.target.name] = evt.target.value;

        this.setState({run});

        this.props.update(run);
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
