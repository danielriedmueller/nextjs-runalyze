import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";
import IGoogleSession from "../../../interfaces/IGoogleSession";
import dayjs from "dayjs";
import {NextApiRequest, NextApiResponse} from "next";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['POST'],
    })
)

export default async function handle(req: NextApiRequest, res: NextApiResponse<IGoogleSession[]>): Promise<void> {
    await cors(req, res);

    const {token, user} = req.body;

    const sessions = [];

    const gApiData = await fetchSessions(user, token);

    sessions.push(...gApiData.session);

    /*
    // TODO Remove if unnecessary
    let nextPageToken = gApiData.nextPageToken;

    while (nextPageToken) {
        const params = new URLSearchParams({pageToken: nextPageToken});
        const gApiResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        const gApiData = await gApiResponse.json();

        if (gApiData.session.length === 0) {
            nextPageToken = null;
        } else {
            sessions.push(...gApiData.session);
            nextPageToken = gApiData.nextPageToken;
        }
    }

     */

    console.log(sessions);

    res.json(sessions);
}

const fetchSessions = async (user: string, token: string): Promise<IGoogleSessionResponse> => {
    let latestRunDate = db.prepare('SELECT startTime FROM runs WHERE user = ? ORDER BY startTime desc').pluck().get(user);

    // Initially get runs from current year
    let startTime = latestRunDate
        // Add 1,5 hours to prevent insert last run
        ? dayjs(latestRunDate + 10000000).toISOString()
        : dayjs(dayjs().year() + '-01-01', 'YYYY-MM-DD').toISOString()

    const activityType = process.env.GOOGLE_API_ACTIVITY_TYPE_RUNNING;
    const params = new URLSearchParams({activityType, startTime});
    const gApiResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    return await gApiResponse.json();
}

interface IGoogleSessionResponse {
    "session": [
        {
            "id": string,
            "name": string,
            "description": string,
            "startTimeMillis": number,
            "endTimeMillis": number,
            "modifiedTimeMillis": number,
            "application": {
                "packageName": string,
                "version": string,
                "detailsUrl": string,
                "name": string
            },
            "activityType": number,
            "activeTimeMillis": number
        }
    ],
    "deletedSession": [
        {
            "id": string,
            "name": string,
            "description": string,
            "startTimeMillis": number,
            "endTimeMillis": number,
            "modifiedTimeMillis": number,
            "application": {
                "packageName": string,
                "version": string,
                "detailsUrl": string,
                "name": string
            },
            "activityType": number,
            "activeTimeMillis": number
        }
    ],
    "nextPageToken": string,
    "hasMoreData": boolean
}
