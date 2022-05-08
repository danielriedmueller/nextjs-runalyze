import React, {FC, ReactElement} from "react";
import GoogleLogin, {GoogleLoginResponse} from "react-google-login";
import IUser from "../interfaces/IUser";
import style from '../style/userarea.module.scss';

interface IProps {
    guser: IUser;
    fetchFitData: () => Promise<void>;
    init: (response: GoogleLoginResponse) => Promise<void>;
    responseGoogleFailed: () => void;
}

const UserArea: FC<IProps> = ({guser, fetchFitData, init, responseGoogleFailed}): ReactElement => <div
    className={style.userarea + " " + style[guser ? 'loggedIn' : 'loggedOut']}>
    {guser ?
        <>
            {guser.unfetchedRuns > 0 ? <div>
                Du kannst {guser.unfetchedRuns} Aktivitäten
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
