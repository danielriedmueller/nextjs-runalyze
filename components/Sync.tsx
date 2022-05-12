import React, {FC, ReactElement} from "react";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import IUser from "../interfaces/IUser";
import style from '../style/sync.module.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface IProps {
    user: IUser;
    init: (response: GoogleLoginResponse) => Promise<void>;
    startImport: () => void;
    responseGoogleFailed: () => void;
    isVisible: boolean;
}

const Sync: FC<IProps> = ({user, init, startImport, responseGoogleFailed, isVisible}): ReactElement => <div className={style[isVisible ? "" : "hidden"] + " " + style.userarea + " " + style[user ? 'loggedIn' : 'loggedOut']}>
    {user ?
        <>
            {user.unfetchedRuns.length > 0 && <div>
                Es können {user.unfetchedRuns.length} Aktivitäten importiert werden.
                <ProgressBar />
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

export default Sync;
