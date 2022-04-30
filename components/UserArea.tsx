import React, {FC, ReactElement} from "react";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import IUser from "../interfaces/IUser";
import style from '../style/userarea.module.scss';

interface IProps {
    user: IUser;
    fetchFitData: () => Promise<void>;
    init: (response: GoogleLoginResponse) => Promise<void>;
    responseGoogleFailed: () => void;
}

const UserArea: FC<IProps> = ({user, fetchFitData, init, responseGoogleFailed}): ReactElement => <div
    className={style.userarea + " " + style[user ? 'loggedIn' : 'loggedOut']}>
    {user ?
        <>
            <div>Hallo {user.name}!</div>
            {user.unfetchedRuns > 0 ? <div>
                Du kannst {user.unfetchedRuns} Aktivitäten
                <button onClick={fetchFitData}>Importieren</button>
            </div> : null}
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

export default UserArea;
