// Initialize the cors middleware
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import dayjs from "dayjs";
import {jsonToRun} from "../../helper/functions";

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
    // Run cors
    await cors(req, res);

    const {token} = req.body;

    const startTime = '2022-04-11T00:00:00.000Z';
    const joggingActivityType = 56;
    const params = new URLSearchParams({
        activityType: joggingActivityType,
        startTime: startTime,
    });

    let runs = [];

    let foo = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json()).then(data => {
        data.session.forEach(async (session) => {
            const run = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
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
            }).then(response => response.json()).then(data => createRun(data.bucket[0]));
        })
    });
    console.log(runs);

    res.json(runs);
}

function createRun(data) {
    const fitnessData = getFitnessDataFromDataset(data.dataset);
    const date = new Date(parseInt(data.session.startTimeMillis));

    return jsonToRun({
        date,
        distance: fitnessData['distance'],
        duration: '11000',
        vdot: 0,
        id: 0
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
