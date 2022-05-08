import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";
import DbRun, {FITNESS_DATA_TYPES} from "../../../model/DbRun";
import {insertRun} from "../insert";
import dayjs from "dayjs";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req: Request, res: Response): Promise<void> {
    await cors(req, res);

    const {token, user} = req.body;

    const gApiData = await fetchSessions(user, token);

    await Promise.all(
        gApiData.session.map(async (session) => {
            const gApiBucketResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "startTimeMillis": session.startTimeMillis,
                    "endTimeMillis": session.endTimeMillis,
                    "aggregateBy": Object.values(FITNESS_DATA_TYPES).map(val => {
                        return {'dataTypeName': val};
                    }),
                    "bucketBySession": {}
                })
            });
            const gApiBucketData = await gApiBucketResponse.json();
            const dbRun = await DbRun.fromGoogleApiData(gApiBucketData.bucket[0]);
            await insertRun(user, dbRun);
        })
    );
}

export const fetchSessions = async (user: string, token: string): Promise<Response> => {
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
