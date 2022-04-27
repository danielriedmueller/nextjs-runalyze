import React, {Component} from "react";
import style from '../../style/singlerun.module.scss';
import IRun from "../../interfaces/IRun";

interface IProps {
    run: IRun;
    statistics: string;
    setStatistics: (currentRun: IRun, statistics: string) => void;
    best?: string;
}

interface IState {
    showHelp: boolean
}

export default class CurrentRunView extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {showHelp: false};
    }

    toggleShowHelp = () => {
        this.setState({showHelp: !this.state.showHelp});
    }

    render() {
        const activeClass = this.props.statistics + 'Active';
        const run = this.props.run;

        if (this.state.showHelp) {
            return <>
                <button className={style.help} onClick={this.toggleShowHelp}></button>
                <div className={style.currentRun + " " + style[activeClass] + ' ' + (run.best.length > 0 ? run.best.map((type) => style[type]).join(" ") : "")}>
                    <div className={style.date}>
                        <small>{run.getDateDay()}<br/>{run.getDate()}</small>
                    </div>
                    <div className={style.pace}>
                        Pace
                    </div>
                    <div className={style.distance}>
                        Distanz
                    </div>
                    <div className={style.duration}>
                        Dauer
                    </div>
                    <div className={style.steps}>
                        Schritte
                    </div>
                    <div className={style.calories}>
                        Kalorien
                    </div>
                </div>
            </>
        }

        return <>
            <button className={style.help} onClick={this.toggleShowHelp}></button>
            <div
                className={style.currentRun + " " + style[activeClass] + ' ' + (run.best.length > 0 ? run.best.map((type) => style[type]).join(" ") : "")}>
                <div className={style.date} onClick={() => this.props.setStatistics(run, 'date')}>
                    <small>{run.getDateDay()}<br/>{run.getDate()}</small>
                </div>
                <div className={style.pace} onClick={() => this.props.setStatistics(run, 'pace')}>
                    {run.getPace()}
                </div>
                <div className={style.distance} onClick={() => this.props.setStatistics(run, 'distance')}>
                    {run.distance}
                </div>
                <div className={style.duration} onClick={() => this.props.setStatistics(run, 'duration')}>
                    {run.getDuration()}
                </div>
                <div className={style.steps}>
                    {run.steps}
                </div>
                <div className={style.calories}>
                    {run.calories}
                </div>
            </div>
        </>
    }
}
