import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import Header from "../components/Header";
import React, {Component} from "react";
import {GoogleLoginResponse} from 'react-google-login';
import RunArea from "../components/RunArea";
import IUser from "../interfaces/IUser";
import IDbRun from "../interfaces/IDbRun";
import Run from "../model/Run";
import {checkFitData, fetchFitData, fetchRuns} from "../helper/fetch";
import Runs from "../model/Runs";
import IRuns from "../interfaces/IRuns";
import isBetween from "dayjs/plugin/isBetween";
import {createRuns, emendDateFilter} from "../helper/functions";
import IDateFilter from "../interfaces/IDateFilter";
import style from "../style/runarea.module.scss";
import {
    getArithmeticModeFromCookie,
    getDateFilterFromCookie,
    getUserIdFromCookie,
    setDateFilterCookie,
    setUserIdCookie
} from "../helper/cookie";
import Sync from "../components/Sync";

require('dayjs/locale/de')

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(isBetween);
dayjs.locale('de');

export enum ArithmeticModes {
    Sum = 1,
    Avg = 2,
    Med = 3,
}

interface IProps {
    runs: IDbRun[],
    filter: IDateFilter;
    mode: ArithmeticModes;
}

interface IState {
    runs: IRuns;
    filter: IDateFilter;
    user: IUser;
    showSync: boolean;
    loadingCount: number;
    mode: ArithmeticModes;
}

class Home extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            runs: Runs.fromRuns(props.runs.map((run) => Run.fromDbRun(run))),
            filter: props.filter,
            user: null,
            showSync: props.runs.length <= 0,
            loadingCount: 0,
            mode: props.mode ? props.mode : ArithmeticModes.Sum
        };
    }

    init = async (response: GoogleLoginResponse): Promise<void> => {
        const user = {
            token: response.accessToken,
            id: response.googleId,
            name: response.profileObj.givenName,
        } as IUser;

        setUserIdCookie(user);

        user.unsynced =  await checkFitData(user);

        const runs = await createRuns(user.id);

        this.setState({user, runs});
    }

    fetchFitData = async (): Promise<void> => {
        let user = this.state.user;
        this.setState({loadingCount: this.state.user.unsynced.length});
        Promise.all(
            user.unsynced.map(async (session, index) => {
                return await fetchFitData(user, session).then(async () => {
                    user.unsynced = user.unsynced.filter((el) => el.startTimeMillis !== session.startTimeMillis);
                    const runs = await createRuns(this.state.user.id);
                    this.setState({
                        user,
                        runs
                    });
                });
            })
        ).then(async () => {
            this.setState({
                loadingCount: 0,
                showSync: false,
            });
        });
    };

    responseGoogleFailed = (): void => {
        console.log('google login failed');
        this.setState({user: null})
    }

    setDateFilter = (filter: IDateFilter): void => {
        filter = emendDateFilter(filter);
        setDateFilterCookie(filter);
        this.setState({filter});
    }

    refresh = async () => {
        this.setState({showSync: !this.state.showSync})
    }

    toggleArithmeticMode = () => {
        let mode = this.state.mode;

        switch(mode) {
            case ArithmeticModes.Sum:
                mode = ArithmeticModes.Avg
                break;
            case ArithmeticModes.Avg:
                mode = ArithmeticModes.Med
                break;
            default:
                mode = ArithmeticModes.Sum
        }

        this.setState({mode})
    }

    render() {
        return <div id="app">
            <button className={style.refreshButton + " " + (this.state.showSync ? style.active : "")}
                    data-state={this.state.user ? this.state.user.unsynced.length : ""}
                    onClick={this.refresh} />
            <Header/>
            <Sync
                user={this.state.user}
                init={this.init}
                startImport={this.fetchFitData}
                responseGoogleFailed={this.responseGoogleFailed}
                isVisible={this.state.showSync}
                loadingCount={this.state.loadingCount}
            />
            <RunArea
                runs={this.state.runs}
                filter={this.state.filter}
                mode={this.state.mode}
                setDateFilter={this.setDateFilter}
            />
            <button onClick={this.toggleArithmeticMode}>{this.state.mode}</button>
        </div>
    }
}

export async function getServerSideProps(ctx): Promise<{ props: IProps }> {
    const userId = getUserIdFromCookie(ctx.req.cookies);
    const filter = getDateFilterFromCookie(ctx.req.cookies);
    const mode = getArithmeticModeFromCookie(ctx.req.cookies);
    const runs = userId ? await fetchRuns(userId) : [];

    return {props: {runs, filter, mode}}
}

export default Home;
