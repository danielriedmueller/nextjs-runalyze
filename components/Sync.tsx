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
    const inserts = user ? user.unsynced.filter(session => session.syncType === SyncType.Insert).length : 0;
    const deletions = user ? user.unsynced.filter(session => session.syncType === SyncType.Delete).length : 0;
    return <div
        className={style[isVisible ? "" : "hidden"] + " " + style.userarea + " " + style[user ? 'loggedIn' : 'loggedOut']}>
        {user ?
            <>
                {loadingCount > 0
                    ? <ProgressBar animated now={calcProgress()}/>
                    : <>
                        <div className={style.insert}>{inserts}&nbsp;x&nbsp;</div>
                        {deletions > 0 && <div className={style.delete}>{deletions}&nbsp;x&nbsp;</div>}
                        {user.unsynced.length > -1 && <div className={style.importButtonContainer}><button className={style.importButton} onClick={startImport} /></div>}
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
