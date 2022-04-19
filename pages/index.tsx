import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeeksInYear from "dayjs/plugin/isoWeeksInYear";
import isLeapYear from "dayjs/plugin/isLeapYear";
import Header from "../components/Header";
import React, {Component} from "react";
import GoogleLogin from 'react-google-login';
import {IRun} from "../interfaces/IRun";

require('dayjs/locale/de')

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.locale('de');

interface AppProps {
    runs: IRun[]
}

interface AppState {
    runs: IRun[]
    user: {
        token: number,
        id: number,
        name: string
    };
}

class Home extends Component<AppProps, AppState> {
    constructor(props) {
        super(props);

        this.state = {
            runs: props.runs,
            user: {
                token: null,
                id: null,
                name: null
            }
        };

        this.fetchFitData = this.fetchFitData.bind(this);
    }

    async fetchFitData(): Promise<void> {
        await fetch(process.env.NEXT_PUBLIC_API_FETCH_GOOGLE_FIT_DATA, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: this.state.user.token,
                user: this.state.user.id
            }),
        });
    }

    responseGoogle = (response): void => {
        const user = {
            token: response.accessToken,
            id: response.googleId,
            name: response.profileObj.givenName
        }
        this.setState({user});
    }

    responseGoogleFailed = (): void => {
        console.log('google login failed');
        this.setState({
            user: {
                token: null,
                id: null,
                name: null
            }
        })
    }

    render() {
        return <div id="app">
            <Header/>
            {this.state.user.token ?
                <button onClick={this.fetchFitData}>Fit Data</button> :
                <GoogleLogin
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogleFailed}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    scope={process.env.NEXT_PUBLIC_GOOGLE_SCOPE}
                />
            }
            {this.state.user.name ? <div>
                Hallo {this.state.user.name}!
            </div> : null}
        </div>
    }
}

export async function getServerSideProps(ctx): Promise<{props: AppProps}> {
    const runsResponse = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS);
    const jsonRuns = await runsResponse.json();

    return {
        props: {
            runs: jsonRuns
        }
    }

    /*


    const lastRun = runs[0].date;
    const filterYear = dayjs(lastRun);
    const jsonYearRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_BETWEEN, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            start: filterYear.startOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
            end: filterYear.endOf('year').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
        }),
    });
    const yearRuns = await jsonYearRuns.json();

    const lastYearRun = yearRuns[0].date;
    const filterMonth = dayjs(lastYearRun);
    const jsonMonthRuns = await fetch(process.env.NEXT_PUBLIC_API_GET_BETWEEN, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            start: filterMonth.startOf('month').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
            end: filterMonth.endOf('month').format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT)
        }),
    });
    const monthRuns = await jsonMonthRuns.json();

    return {
        props: {
            runs: runs,
            yearRuns: yearRuns,
            monthRuns: monthRuns
        }
    };

     */
}

export default Home;
