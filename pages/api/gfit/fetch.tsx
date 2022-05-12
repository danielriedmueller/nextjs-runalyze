import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";
import DbRun, {FITNESS_DATA_TYPES} from "../../../model/DbRun";
import {insertRun} from "../insert";
import dayjs from "dayjs";
import {exampleDataSessions} from "./check";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['POST'],
    })
)

export default async function handle(req: Request, res: Response): Promise<boolean> {
    await cors(req, res);

    const {token, user, session} = req.body;

    //const gApiData = await fetchSessions(user, token);

    const run = exampleRunData.find(run => {
        return parseInt(run.startTime) === session.startTimeMillis && parseInt(run.endTime) === session.endTimeMillis;
    })

    await task();
    async function task() {
        return new Promise(res => {
            setTimeout(res, Math.random() * 3000);
        })
    }

    console.log(run);
    return res.json(true);
    /*
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
            console.log(dbRun)
            //await insertRun(user, dbRun);
        })
    );

     */
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

const exampleRunData = [{
        id: undefined,
        calories: 416.9191114046638,
        distance: 4913.288583451928,
        endTime: '1650216719722',
        startTime: '1650215043703',
        steps: 4637,
        vdot: 32.8
    }, {
        id: undefined,
        calories: 868.5494083884224,
        distance: 10007.225053610715,
        endTime: '1650023086874',
        startTime: '1650019530562',
        steps: 9792,
        vdot: 32.8
    }, {
        id: undefined,
        calories: 363.59132236736014,
        distance: 4291.081799452763,
        endTime: '1650796098446',
        startTime: '1650794688726',
        steps: 3944,
        vdot: 34.1
    }, {
        id: undefined,
        calories: 456.7005319681765,
        distance: 5222.167044752219,
        endTime: '1651841513228',
        startTime: '1651839875279',
        steps: 4633,
        vdot: 36.5
    }, {
        id: undefined,
        calories: 454.56382449764413,
        distance: 5205.3319922682595,
        endTime: '1651075989977',
        startTime: '1651074369951',
        steps: 4551,
        vdot: 36.8
    }, {
        id: undefined,
        calories: 482.66681837419304,
        distance: 5506.602698322681,
        endTime: '1651311514256',
        startTime: '1651309737785',
        steps: 4939,
        vdot: 35.4
    }, {
        id: undefined,
        calories: 413.1266776575851,
        distance: 4884.837232932805,
        endTime: '1650642074222',
        startTime: '1650640460531',
        steps: 4469,
        vdot: 34.1
    }, {
        id: undefined,
        calories: 451.8039448156799,
        distance: 5128.978277561392,
        endTime: '1649859818843',
        startTime: '1649857811684',
        steps: 4954,
        vdot: 27.9
    }, {
        id: undefined,
        calories: 385.00774535573487,
        distance: 4367.544254904339,
        endTime: '1651676521345',
        startTime: '1651675028229',
        steps: 4122,
        vdot: 32.5
    }
]
