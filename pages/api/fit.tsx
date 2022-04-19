import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {insertRun} from "./upsert";

dayjs.extend(duration);

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const fitnessDataTypes = {
    'distance': 'com.google.distance.delta',
    'steps': 'com.google.step_count.delta',
    'calories': 'com.google.calories.expended'
}

interface FitnessData {
    distance: number;
    steps: number;
    calories: number;
}

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req: Request, res: Response): Promise<void> {
    await cors(req, res);

    const {token, user} = req.body;

    let latestRunDate = db.prepare('SELECT startTime FROM runs ORDER BY startTime desc').pluck().get();
    // Initially get runs from current year
    let startTime = latestRunDate
        // Add 1,5 hours to prevent insert last run
        ? dayjs(latestRunDate + 10000000).toISOString()
        : dayjs(dayjs().year() + '-01-01', 'YYYY-MM-DD').toISOString()

    const activityType = '56';
    const params = new URLSearchParams({activityType, startTime});
    const gApiResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const gApiData = await gApiResponse.json();
    console.log(gApiData)

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
                    "aggregateBy": Object.values(fitnessDataTypes).map(val => {
                        return {'dataTypeName': val};
                    }),
                    "bucketBySession": {}
                })
            });
            const gApiBucketData = await gApiBucketResponse.json();
            const bucket = gApiBucketData.bucket[0];
            const {distance, calories, steps} = getFitnessDataFromDataset(bucket.dataset);
            await insertRun(
                bucket.session.startTimeMillis,
                bucket.session.endTimeMillis,
                distance,
                calories,
                user,
                steps
            );
        })
    );
}

const getFitnessDataFromDataset = (datasets): FitnessData => {
    let fitnessData = [];

    datasets.forEach((dataset) => {
        dataset.point.forEach((point) => {
            Object.entries(fitnessDataTypes).forEach(([type, apiName]) => {
                if (point.dataTypeName === apiName) {
                    if (!Array.isArray(fitnessData[type])) {
                        fitnessData[type] = [];
                    }

                    // Get always first value only, see Google API Response documentation
                    fitnessData[type].push(...point.value.map(valObj => valObj[Object.keys(valObj)[0]]));
                }
            })
        })
    });

    let response = {};
    for (const type in fitnessData) {
        response[type] = fitnessData[type].reduce((a, b) => a + b);
    }

    return response as FitnessData;
}
