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
import {emendDateFilter} from "../helper/functions";
import IDateFilter from "../interfaces/IDateFilter";
import style from "../style/runarea.module.scss";
import {getDateFilterFromCookie, getUserIdFromCookie, setDateFilterCookie, setUserIdCookie} from "../helper/cookie";
import Sync from "../components/Sync";

require('dayjs/locale/de')

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(isBetween);
dayjs.locale('de');

interface IProps {
    runs: IDbRun[],
    filter: IDateFilter;
}

interface IState {
    runs: IRuns;
    filter: IDateFilter;
    user: IUser;
    showSync: boolean;
    loadingCount: number;
}

class Home extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            runs: Runs.fromRuns(props.runs.map((run) => Run.fromDbRun(run))),
            filter: props.filter,
            user: null,
            showSync: false,
            loadingCount: 0
        };
    }

    init = async (response: GoogleLoginResponse): Promise<void> => {
        const user = {
            token: response.accessToken,
            id: response.googleId,
            name: response.profileObj.givenName,
        } as IUser;

        setUserIdCookie(user);
        user.unfetchedRuns = await checkFitData(user);
        console.log('init')
        this.setState({user});
    }

    fetchFitData = async (): Promise<void> => {
        let user = this.state.user;
        this.setState({loadingCount: this.state.user.unfetchedRuns.length});
        Promise.all(
            user.unfetchedRuns.map(async (session, index) => {
                return await fetchFitData(user, session).then(() => {
                    user.unfetchedRuns = user.unfetchedRuns.filter((el) => el.startTimeMillis !== session.startTimeMillis);
                    this.setState({user})
                });
            })
        ).then(async () => {
            this.setState({
                loadingCount: 0,
                showSync: false,
            });
            let runs = await fetchRuns(this.state.user.id);
            this.setState({
                runs: Runs.fromRuns(runs.map((run) => Run.fromDbRun(run)))
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

    render() {
        return <div id="app">
                <button className={style.refreshButton}
                        data-state={this.state.user ? this.state.user.unfetchedRuns.length : ""}
                        onClick={this.refresh}></button>
            <Header/>
            <Sync
                user={this.state.user}
                init={this.init}
                startImport={this.fetchFitData}
                responseGoogleFailed={this.responseGoogleFailed}
                isVisible={this.state.showSync}
                loadingCount={this.state.loadingCount}
            />
            {this.state.runs.getCount() > 0 && <RunArea
                runs={this.state.runs}
                filter={this.state.filter}
                setDateFilter={this.setDateFilter}
            />}
        </div>
    }
}

export async function getServerSideProps(ctx): Promise<{ props: IProps }> {
    const userId = getUserIdFromCookie(ctx.req.cookies);
    const filter = getDateFilterFromCookie(ctx.req.cookies);
    console.log(userId)
    const runs = userId ? await fetchRuns(userId) : [];

    return {props: {runs, filter}}
}

export default Home;
