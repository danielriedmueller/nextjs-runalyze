import React, {FC, ReactElement} from "react";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import IUser from "../interfaces/IUser";
import style from '../style/sync.module.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IProps {
    user: IUser;
    init: (response: GoogleLoginResponse) => Promise<void>;
    startImport: () => void;
    responseGoogleFailed: () => void;
    isVisible: boolean;
    loadingCount: number;
}

const Sync: FC<IProps> = ({user, init, startImport, responseGoogleFailed, isVisible, loadingCount}): ReactElement => {
    const calcProgress = (): number => 100 - (user.unfetchedRuns.length * 100 / loadingCount);
    return <div
        className={style[isVisible ? "" : "hidden"] + " " + style.userarea + " " + style[user ? 'loggedIn' : 'loggedOut']}>
        {user ?
            <>
                {user.unfetchedRuns.length > 0 && <div>
                    Es können {user.unfetchedRuns.length} Aktivitäten importiert werden.
                    {loadingCount > 0 && <ProgressBar animated now={calcProgress()}/>}
                    <button className={style.importButton} onClick={startImport}></button>
                </div>}
            </> :
            <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                buttonText="Mit Google einloggen"
                onSuccess={init}
                onFailure={responseGoogleFailed}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
                scope={process.env.NEXT_PUBLIC_GOOGLE_SCOPE}
            />
        }
    </div>;
}

export default Sync;