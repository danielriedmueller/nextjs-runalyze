import React, {FC, ReactElement, ReactNode} from "react";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import IUser from "../interfaces/IUser";
import style from '../style/sync.module.scss';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {SyncType} from "../interfaces/IGoogleSession";

interface IProps {
    user: IUser;
    init: (response: GoogleLoginResponse) => Promise<void>;
    startImport: () => void;
    responseGoogleFailed: () => void;
    isVisible: boolean;
    loadingCount: number;
}

const Sync: FC<IProps> = ({user, init, startImport, responseGoogleFailed, isVisible, loadingCount}): ReactElement => {
    const calcProgress = (): number => 100 - (user.unsynced.length * 100 / loadingCount);
    return <div
        className={style[isVisible ? "" : "hidden"] + " " + style.userarea + " " + style[user ? 'loggedIn' : 'loggedOut']}>
        {user ?
            <>
                {loadingCount > 0
                    ? <ProgressBar animated now={calcProgress()}/>
                    : <>
                        <div className={style.insert}>{user.unsynced.filter(session => session.syncType === SyncType.Insert).length} x</div>
                        <div className={style.delete}>{user.unsynced.filter(session => session.syncType === SyncType.Delete).length} x</div>
                        {user.unsynced.length > 0 && <button className={style.importButton} onClick={startImport} />}
                    </>
                }
            </> :
            <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
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
