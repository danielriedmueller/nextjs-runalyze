import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import Header from "../components/Header";
import React, {Component} from "react";
import GoogleLogin, {GoogleLoginResponse} from 'react-google-login';
import RunArea from "../components/RunArea";
import IUser from "../interfaces/IUser";
import IDbRun from "../interfaces/IDbRun";
import Run from "../model/Run";
import {checkFitData, fetchRuns} from "../helper/fetch";
import Runs from "../model/Runs";
import IRuns from "../interfaces/IRuns";
import isBetween from "dayjs/plugin/isBetween";
import {emendDateFilter} from "../helper/functions";
import IDateFilter from "../interfaces/IDateFilter";
import ZeroRuns from "../model/ZeroRuns";
import style from "../style/runarea.module.scss";
import IGoogleSession from "../interfaces/IGoogleSession";
import {getDateFilterFromCookie, getUserIdFromCookie, setDateFilterCookie, setUserIdCookie} from "../helper/cookie";

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
    unfetchedRuns: IGoogleSession[];
    isLoadingCount: number;
}

class Home extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            runs: Runs.fromRuns(props.runs.map((run) => Run.fromDbRun(run))),
            filter: props.filter,
            user: null,
            unfetchedRuns: null,
            isLoadingCount: 0,
        };
    }

    init = async (response: GoogleLoginResponse): Promise<void> => {
        const user = {
            token: response.accessToken,
            id: response.googleId,
            name: response.profileObj.givenName,
        } as IUser;

        setUserIdCookie(user);

        const unfetchedRuns = await checkFitData(user);

        this.setState({
            user,
            unfetchedRuns
        });
        await this.fetchFitData();

        console.log('init')
    }

    fetchFitData = async (): Promise<void> => {
        this.setState({isLoadingCount: this.state.unfetchedRuns.length});
        let runs = await fetchRuns(this.state.user.id);
        this.setState({
            runs: Runs.fromRuns(runs.map((run) => Run.fromDbRun(run))),
            isLoadingCount: 0
        });
    };

    responseGoogleFailed = (): void => {
        console.log('google login failed');
        this.setState({user: null, unfetchedRuns: null})
    }

    setDateFilter = (filter: IDateFilter): void => {
        filter = emendDateFilter(filter);
        setDateFilterCookie(filter);
        this.setState({filter});
    }

    refresh = async () => {

        /*
                const user = this.state.user;
        if (!user || !user.token) {
            this.setState({showGoogleLogin: true})

            return;
        }
        const unfetchedRuns = await checkFitData(user);
        this.setState({unfetchedRuns});
        Promise.all(
            user.unfetchedRuns.map(async (session) => {

                this.setState({
                    isLoadingCount: this.state.isLoadingCount - 1
                });

                return await fetchFitData(user, session);
            })
        ).then(async () => {
            let runs = await fetchRuns(this.state.user.id);
            this.setState({
                runs: Runs.fromRuns(runs.map((run) => Run.fromDbRun(run))),
                isLoadingCount: 0
            });
        });

         */
    }

    render() {
        return <div id="app">
            <Header/>
            <button className={style.refreshButton} data-state={this.state.unfetchedRuns ? this.state.unfetchedRuns.length : ""}
                    onClick={this.refresh}></button>
            <div>Zu importieren {this.state.unfetchedRuns ? this.state.unfetchedRuns.length : ""}</div>
            {!this.state.user && <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                buttonText="Mit Google einloggen"
                onSuccess={this.init}
                onFailure={this.responseGoogleFailed}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                scope={process.env.NEXT_PUBLIC_GOOGLE_SCOPE}
            />}
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
    const runs = userId ? await fetchRuns(userId) : [];

    return {props: {runs, filter}}
}

export default Home;
