import {IEditRun} from "../interfaces/IEditRun";
import {IRun} from "../interfaces/IRun";

export const upsertRun = async (run: IEditRun): Promise<void> => {
    try {
        await fetch(process.env.NEXT_PUBLIC_API_UPSERT_RUN, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(run),
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