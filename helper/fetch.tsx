import IUser from "../interfaces/IUser";
import IDbRun from "../interfaces/IDbRun";
import IGoogleSession from "../interfaces/IGoogleSession";

export const fetchRuns = async (userId: string): Promise<IDbRun[]> => {
    try {
        const runsResponse = await fetch(process.env.NEXT_PUBLIC_API_GET_RUNS, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user: userId
            }),
        });

        return await runsResponse.json() as IDbRun[];
    } catch (error) {
        console.error(error)
    }
}

export const fetchFitData = async (user: IUser, session: IGoogleSession): Promise<boolean> => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_FETCH_GOOGLE_FIT_DATA, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: user.token,
                user: user.id,
                session
            }),
        });

        return await response.json();
    } catch (error) {
        console.error(error)
    }
}

export const checkFitData = async (user: IUser): Promise<IGoogleSession[]> => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_CHECK_GOOGLE_FIT_DATA, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: user.token,
                user: user.id
            }),
        });

        return await response.json() as IGoogleSession[];
    } catch (error) {
        console.error(error)
    }
}
