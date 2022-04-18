// Initialize the cors middleware
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {durationToString, jsonToRun} from "../../helper/functions";
import {getVdot} from "./vdot";
dayjs.extend(duration);

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const fitnessDataTypes = {
    'distance': 'com.google.distance.delta',
    'steps': 'com.google.step_count.delta',
    'calories': 'com.google.calories.expended'
}

const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function handle(req, res) {
    let runs = [];

    // Run cors
    await cors(req, res);

    const {token} = req.body;

    let latestRunDate = db.prepare('SELECT date FROM runs ORDER BY date desc').pluck().get();
    latestRunDate = dayjs(latestRunDate).toISOString();

    const startTime = latestRunDate;
    const joggingActivityType = 56;
    const params = new URLSearchParams({
        activityType: joggingActivityType,
        startTime: startTime,
    });

    const gApiResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const gApiData = await gApiResponse.json();

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
            const run = await createRun(gApiBucketData.bucket[0]);
            runs.push(run);
        })
    );

    res.json(runs);
}

async function createRun(data) {
    const fitnessData = getFitnessDataFromDataset(data.dataset);
    const durationInMillis = data.session.endTimeMillis - data.session.startTimeMillis;

    const date = new Date(parseInt(data.session.startTimeMillis));
    const distance = fitnessData['distance'];
    const duration = durationToString(dayjs.duration(durationInMillis, 'ms'));
    const vdot = await getVdot(distance, duration);

    db.prepare('INSERT INTO runs(date, distance, duration, vdot) VALUES(?, ?, ?, ?)').run(
        dayjs(date).format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
        distance,
        duration,
        vdot
    );

    // Todo: 0 equals insert instead of update
    const id = 0;

    return jsonToRun({
        date,
        distance,
        duration,
        vdot,
        id
    });
}

function getFitnessDataFromDataset(datasets) {
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

    for (const type in fitnessData) {
        fitnessData[type] = fitnessData[type].reduce((a, b) => a + b);
    }

    return fitnessData;
}
