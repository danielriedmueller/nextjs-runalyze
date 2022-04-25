import IEditRun from "../interfaces/IEditRun";
import IRun from "../interfaces/IRun";
import IUser from "../interfaces/IUser";
import {encryptUser} from "./crypto";
import IDbRun from "../interfaces/IDbRun";

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

export const fetchFitData = async (user: IUser): Promise<void> => {
    try {
        await fetch(process.env.NEXT_PUBLIC_API_FETCH_GOOGLE_FIT_DATA, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: user.token,
                user: user.id
            }),
        });
    } catch (error) {
        console.error(error)
    }
}

export const checkFitData = async (user: IUser): Promise<number> => {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_CHECK_GOOGLE_FIT_DATA, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token: user.token,
                user: user.id
            }),
        });

        return await response.json() as number;
    } catch (error) {
        console.error(error)
    }
}

export const updateRun = async (run: IEditRun): Promise<void> => {
    try {
        await fetch(process.env.NEXT_PUBLIC_API_UPDATE_RUN, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({run}),
        })
    } catch (error) {
        console.error(error)
    }
}

export const insertRun = async (run: IEditRun, user: IUser): Promise<void> => {
    try {
        await fetch(process.env.NEXT_PUBLIC_API_INSERT_RUN, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({run, user: encryptUser(user.id)}),
        })
    } catch (error) {
        console.error(error)
    }
}

export const deleteRun = async (run: IRun): Promise<void> => {
    try {
        await fetch(process.env.NEXT_PUBLIC_API_DELETE_RUN, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: run.id}),
        })
    } catch (error) {
        console.error(error)
    }
}
