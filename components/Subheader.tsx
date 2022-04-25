import React, {Component} from "react";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import IUser from "../interfaces/IUser";
import style from '../style/subheader.module.scss';

interface IProps {
    user: IUser;
    fetchFitData: () => Promise<void>;
    init: (response: GoogleLoginResponse) => Promise<void>;
    responseGoogleFailed: () => void;
}

interface IState {
}

export default class Subheader extends Component<IProps, IState> {
    render() {
        const loggedInCls = this.props.user ? 'loggedIn' : 'loggedOut'
        return <div className={style.subheader + " " + style[loggedInCls]}>
            {this.props.user ?
                <>
                    <div>Hallo {this.props.user.name}! Du hast {this.props.user.unfetchedRuns} Aktivitäten zum
                        Importieren
                    </div>
                    <button onClick={this.props.fetchFitData}>Importieren</button>
                </> :
                <GoogleLogin
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                    buttonText="Mit Google einloggen"
                    onSuccess={this.props.init}
                    onFailure={this.props.responseGoogleFailed}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    scope={process.env.NEXT_PUBLIC_GOOGLE_SCOPE}
                />
            }
        </div>
    }
}
