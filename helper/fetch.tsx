import IUser from "../interfaces/IUser";
import IApiRun from "../interfaces/IApiRun";

export const fetchRuns = async (token: string): Promise<IApiRun[]> => {
    try {
        const runsResponse = await fetch(process.env.NEXT_PUBLIC_API_FETCH_GOOGLE_FIT_DATA, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                token
            }),
        });

        return await runsResponse.json() as IApiRun[];
    } catch (error) {
        console.error(error)
    }
}
