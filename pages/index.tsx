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
import {fetchFitData, fetchRuns} from "../helper/fetch";
import Runs from "../model/Runs";
import IRuns from "../interfaces/IRuns";
import isBetween from "dayjs/plugin/isBetween";

require('dayjs/locale/de')

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(isBetween);
dayjs.locale('de');

export const USER_ID_COOKIE = 'user_id';
export const DATE_FILTER_COOKIE = 'date_filter';

interface IProps {
    runs: IDbRun[],
    dateFilter?: string;
}

interface IState {
    runs: IRuns
    user: IUser;
}

class Home extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            runs: new Runs(props.runs.map((run) => Run.fromDbRun(run)), props.dateFilter),
            user: null
        };
    }

    init = async (response: GoogleLoginResponse): Promise<void> => {
        const user = {
            token: response.accessToken,
            id: response.googleId,
            name: response.profileObj.givenName
        }

        this.setState({user});
        document.cookie = USER_ID_COOKIE + "=" + user.id;
    }

    fetchFitData = async (): Promise<void> => fetchFitData(this.state.user);

    responseGoogleFailed = (): void => {
        console.log('google login failed');
        this.setState({user: null})
    }

    refreshRuns = async (): Promise<void> => {
        const runs = await fetchRuns(this.state.user.id);
        this.setState({runs: new Runs(runs.map((run) => Run.fromDbRun(run)))});
    }

    setDateFilter = (filter: string): void => {
        let runs = this.state.runs;
        runs.setFilter(filter);
        this.setState({runs});
    }

    render() {
        return <div id="app">
            <Header/>
            {this.state.user ?
                <>
                    <button onClick={this.fetchFitData}>Fit Data</button>
                    <div>Hallo {this.state.user.name}!</div>
                </> :
                <GoogleLogin
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={this.init}
                    onFailure={this.responseGoogleFailed}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    scope={process.env.NEXT_PUBLIC_GOOGLE_SCOPE}
                />
            }
            {this.state.runs && this.state.user ? <RunArea
                runs={this.state.runs}
                user={this.state.user}
                refresh={this.refreshRuns}
                setDateFilter={this.setDateFilter}
            /> : null}
        </div>
    }
}

export async function getServerSideProps(ctx): Promise<{ props: IProps }> {
    const userId = ctx.req.cookies[USER_ID_COOKIE];
    const dateFilter = ctx.req.cookies[DATE_FILTER_COOKIE];

    if (userId) {
        const runs = await fetchRuns(userId);
        return {props: {runs, dateFilter}}
    }

    return {props: {runs: [], dateFilter: null}}
}

export default Home;
