import React, {Component, ReactNode} from "react";
import style from '../../style/singlerun.module.scss';
import IRun from "../../interfaces/IRun";

interface IProps {
    run: IRun;
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
        const run = this.props.run;

        return <>
            <button className={style.help} onClick={this.toggleShowHelp}></button>
            {!run ? renderNoRunContent() : this.state.showHelp ? renderHelpContent(run) :
                <div
                    className={style.currentRun + " " + (run.best.length > 0 ? run.best.map((type) => style[type]).join(" ") : "")}>
                    <div className={style.date}>
                        <small>{run.getDateDay()}<br/>{run.getDate()}</small>
                    </div>
                    <div className={style.stats}>
                        <div className={style.pace}>
                            <span className={style[run.paceTrend]}>{run.getPace()}</span>
                        </div>
                        <div className={style.distance}>
                            <span className={style[run.distanceTrend]}>{run.renderDistance()}</span>
                        </div>
                        <div className={style.duration}>
                            <span className={style[run.durationTrend]}>{run.getDuration()}</span>
                        </div>
                        <div className={style.vdot}>
                            <span className={style[run.vdotTrend]}>{run.vdot}</span>
                        </div>
                        <div className={style.steps}>
                            {run.steps}
                        </div>
                        <div className={style.calories}>
                            {run.renderCalories()}
                        </div>
                    </div>
                </div>
            }
        </>
    }
}

const renderHelpContent = (run: IRun): ReactNode => <div
    className={style.currentRun + " " + (run.best.length > 0 ? run.best.map((type) => style[type]).join(" ") : "")}>
    <div className={style.date}>
        <small>{run.getDateDay()}<br/>{run.getDate()}</small>
    </div>
    <div className={style.stats}>
        <div className={style.pace}>
            Pace in M/km
        </div>
        <div className={style.distance}>
            Distanz in km
        </div>
        <div className={style.duration}>
            Dauer
        </div>
        <div className={style.vdot}>
            VDOT
        </div>
        <div className={style.steps}>
            Schritte
        </div>
        <div className={style.calories}>
            Kalorien
        </div>
    </div>
</div>;

const renderNoRunContent = (): ReactNode => <div
    className={style.currentRun}>
    <div className={style.date}>
        <small>-</small>
    </div>
    <div className={style.stats}>
        <div className={style.pace}>
            -
        </div>
        <div className={style.distance}>
            -
        </div>
        <div className={style.duration}>
            -
        </div>
        <div className={style.vdot}>
            -
        </div>
        <div className={style.steps}>
            -
        </div>
        <div className={style.calories}>
            -
        </div>
    </div>
</div>;
