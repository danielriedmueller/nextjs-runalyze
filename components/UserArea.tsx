import React, {Component} from "react";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import IUser from "../interfaces/IUser";
import style from '../style/userarea.module.scss';

interface IProps {
    user: IUser;
    fetchFitData: () => Promise<void>;
    init: (response: GoogleLoginResponse) => Promise<void>;
    responseGoogleFailed: () => void;
}

interface IState {
}

export default class UserArea extends Component<IProps, IState> {
    render() {
        const loggedInCls = this.props.user ? 'loggedIn' : 'loggedOut'
        return <div className={style.userarea + " " + style[loggedInCls]}>
            {this.props.user ?
                <>
                    <div>Hallo {this.props.user.name}! Du kannst {this.props.user.unfetchedRuns} Aktivitäten
                        <button onClick={this.props.fetchFitData}>Importieren</button>
                    </div>
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
