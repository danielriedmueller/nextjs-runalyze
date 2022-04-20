import IEditRun from "../interfaces/IEditRun";
import IRun from "../interfaces/IRun";
import IUser from "../interfaces/IUser";
import {encryptUser} from "./crypto";

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
            body: run.id.toString(),
        })
    } catch (error) {
        console.error(error)
    }
}
