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
import IRun from "../interfaces/IRun";
import IUser from "../interfaces/IUser";
import IDbRun from "../interfaces/IDbRun";
import {Run} from "../model/Run";

require('dayjs/locale/de')

dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeeksInYear);
dayjs.extend(isLeapYear);
dayjs.locale('de');

const USER_ID_COOKIE = 'user_id';

interface IProps {
    runs?: IDbRun[]
}

interface IState {
    runs?: IRun[]
    user: IUser;
}

class Home extends Component<IProps, IState> {
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

    fetchFitData = async (): Promise<void> => {
        await fetch(process.env.NEXT_PUBLIC_API_FETCH_GOOGLE_FIT_DATA, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: this.state.user.token,
                user: this.state.user.id
            }),
        });
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
                    onSuccess={this.init}
                    onFailure={this.responseGoogleFailed}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    scope={process.env.NEXT_PUBLIC_GOOGLE_SCOPE}
                />
            }
            {this.state.user.name ? <div>
                Hallo {this.state.user.name}!
            </div> : null}
            {this.state.runs ? <RunArea
                runs={this.state.runs}
            /> : null }
        </div>
    }
}

export async function getServerSideProps(ctx): Promise<{props: IProps}> {
    const userId = ctx.req.cookies[USER_ID_COOKIE];

    if (userId) {
        const runsResponse = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user: userId
            }),
        });
        let runs = await runsResponse.json() as IDbRun[];

        return {props: {runs}}
    }

    return {props: {runs: null}}
}

export default Home;
