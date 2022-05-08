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
import {getDateFilterFromCookie, getUserIdFromCookie, setDateFilterCookie, setUserIdCookie} from "../helper/cookie";
import {emendDateFilter} from "../helper/functions";
import IDateFilter from "../interfaces/IDateFilter";
import UserArea from "../components/UserArea";
import ZeroRuns from "../model/ZeroRuns";

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
    guser: IUser;
    isLoading: boolean;
}

class Home extends Component<IProps, IState> {
    constructor(props) {
        super(props);

        this.state = {
            runs: Runs.fromRuns(props.runs.map((run) => Run.fromDbRun(run))),
            filter: props.filter,
            guser: null,
            isLoading: false
        };
    }

    init = async (response: GoogleLoginResponse): Promise<void> => {
        const guser = {
            token: response.accessToken,
            id: response.googleId,
            name: response.profileObj.givenName,
        } as IUser;

        setUserIdCookie(guser);

        guser.unfetchedRuns = await checkFitData(guser);

        this.setState({guser});
    }

    fetchFitData = async (): Promise<void> => {
        this.setState({isLoading: true});
        await fetchFitData(this.state.guser);
        let runs = await fetchRuns(this.state.guser.id);
        this.setState({
            runs: Runs.fromRuns(runs.map((run) => Run.fromDbRun(run))),
            isLoading: false
        });
    };

    responseGoogleFailed = (): void => {
        console.log('google login failed');
        this.setState({guser: null})
    }

    setDateFilter = (filter: IDateFilter): void => {
        filter = emendDateFilter(filter);
        setDateFilterCookie(filter);
        this.setState({filter});
    }

    refresh = () => {
        this.setState({runs: new ZeroRuns()})
    }

    render() {
        return <div id="app">
            <Header/>
            {!this.state.isLoading ?
                this.state.runs.getCount() > 0 ? <RunArea
                    runs={this.state.runs}
                    filter={this.state.filter}
                    setDateFilter={this.setDateFilter}
                    refresh={this.refresh}
                /> : <UserArea
                    guser={this.state.guser}
                    fetchFitData={this.fetchFitData}
                    init={this.init}
                    responseGoogleFailed={this.responseGoogleFailed}
                />
                : <div>loading</div>
            }
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
