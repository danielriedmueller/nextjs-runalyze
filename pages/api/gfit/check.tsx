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

export default async function handle(req: NextApiRequest, res: NextApiResponse<{sessions: IGoogleSession[], deletedSessions: IGoogleSession[]}>): Promise<void> {
    await cors(req, res);
    const {token, user} = req.body;

    let sessions = await fetchSessions(user, token);

    // Check for already existing runs and filter sesssions accordingly
    sessions = sessions.filter((session) => {
        let existingRun = db
            .prepare('SELECT * FROM runs WHERE startTime = ? AND endTime = ? AND user = ?')
            .all(session.startTimeMillis, session.endTimeMillis, user);

        return existingRun.length === 0;
    });

    const deletedSessions = await fetchDeletedSessions(user, token);

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

    res.json({sessions, deletedSessions});
}

const fetchSessions = async (user: string, token: string): Promise<IGoogleSession[]> => {
    const activityType = process.env.GOOGLE_API_ACTIVITY_TYPE_RUNNING;
    const fields = 'session(startTimeMillis,endTimeMillis)';

    const params = new URLSearchParams({
        activityType,
        fields
    });

    // Get newest run as startTime
    let startTime = db.prepare('SELECT startTime FROM runs WHERE user = ? ORDER BY startTime desc').pluck().get(user);
    if (startTime) {
        params.set('startTime', dayjs(startTime).toISOString());
    }

    const gApiResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const gApiData = await gApiResponse.json() as IGoogleSessionResponse;

    return gApiData.session;
}

const fetchDeletedSessions = async (user: string, token: string): Promise<IGoogleSession[]> => {
    const activityType = process.env.GOOGLE_API_ACTIVITY_TYPE_RUNNING;
    const includeDeleted = "true";
    const fields = 'deletedSession(startTimeMillis,endTimeMillis)';

    const params = new URLSearchParams({
        activityType,
        includeDeleted,
        fields
    });

    const gApiResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    const gApiData = await gApiResponse.json() as IGoogleSessionResponse;

    return gApiData.deletedSession;
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
