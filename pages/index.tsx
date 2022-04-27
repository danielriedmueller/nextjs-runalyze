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
import Run from "../model/Run";
import Runs from "../model/Runs";
import IRuns from "../interfaces/IRuns";
import isBetween from "dayjs/plugin/isBetween";
import {setDateFilterCookie, setUserIdCookie} from "../helper/cookie";
import {emendDateFilter} from "../helper/functions";
import IDateFilter from "../interfaces/IDateFilter";
import UserArea from "../components/UserArea";
import {fetchRuns} from "../helper/fetch";
import IApiRun from "../interfaces/IApiRun";

require('dayjs/locale/de')

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.extend(isBetween);
dayjs.locale('de');

interface IProps {
    runs: IApiRun[],
    filter: IDateFilter;
}

interface IState {
    runs: IRuns;
    filter: IDateFilter;
    user: IUser;
}

class Home extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            runs: null,
            filter: {
                year: null,
                month: null,
                week: null
            },
            user: null
        };
    }

    init = async (response: GoogleLoginResponse): Promise<void> => {
        const user = {
            token: response.accessToken,
            id: response.googleId,
            name: response.profileObj.givenName,
        } as IUser;

        setUserIdCookie(user);
        const runs = await fetchRuns(user.token);

        this.setState({
            runs: new Runs(runs.map(run => Run.fromApiRun(run))),
            user
        });
    }

    responseGoogleFailed = (): void => {
        console.log('google login failed');
        this.setState({user: null})
    }

    refreshRuns = async (): Promise<void> => {
        const runs = await fetchRuns(this.state.user.token);
        this.setState({runs: new Runs(runs.map((run) => Run.fromApiRun(run)))});
    }

    setDateFilter = (filter: IDateFilter): void => {
        filter = emendDateFilter(filter);
        setDateFilterCookie(filter);
        this.setState({filter});
    }

    render() {
        return <div id="app">
            <Header/>
            <UserArea
                user={this.state.user}
                init={this.init}
                responseGoogleFailed={this.responseGoogleFailed}
            />
            {this.state.runs && this.state.user ? <RunArea
                runs={this.state.runs}
                user={this.state.user}
                filter={this.state.filter}
                refresh={this.refreshRuns}
                setDateFilter={this.setDateFilter}
            /> : null}
        </div>
    }
}

export default Home;
