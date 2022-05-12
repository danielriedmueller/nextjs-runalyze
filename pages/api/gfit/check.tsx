import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";
import {fetchSessions} from "./fetch";
import IGoogleSession from "../../../interfaces/IGoogleSession";

const cors = initMiddleware(
    Cors({
        methods: ['POST'],
    })
)

export default async function handle(req: Request, res: Response): Promise<IGoogleSession[]> {
    await cors(req, res);

    const {token, user} = req.body;

    const sessions = [];

    const gApiData = await fetchSessions(user, token);

    // TODO Remove if unbecessary

    sessions.push(...gApiData.session);
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

    console.log(sessions)

    return res.json(sessions);
}

export const exampleDataSessions = {
    session: [
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1649857811614',
            name: 'Joggen am Nachmittag',
            description: '',
            startTimeMillis: '1649857811684',
            endTimeMillis: '1649859818843',
            modifiedTimeMillis: '1649862996843',
            application: [Object],
            activityType: 56
        },
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1650019530508',
            name: 'Joggen am Mittag',
            description: '',
            startTimeMillis: '1650019530562',
            endTimeMillis: '1650023086874',
            modifiedTimeMillis: '1650036035919',
            application: [Object],
            activityType: 56
        },
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1650215043658',
            name: 'Joggen am Abend',
            description: '',
            startTimeMillis: '1650215043703',
            endTimeMillis: '1650216719722',
            modifiedTimeMillis: '1650219378053',
            application: [Object],
            activityType: 56
        },
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1650640460423',
            name: 'Joggen am Nachmittag',
            description: '',
            startTimeMillis: '1650640460531',
            endTimeMillis: '1650642074222',
            modifiedTimeMillis: '1650644706808',
            application: [Object],
            activityType: 56
        },
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1650794688653',
            name: 'Joggen am Mittag',
            description: '',
            startTimeMillis: '1650794688726',
            endTimeMillis: '1650796098446',
            modifiedTimeMillis: '1650796102909',
            application: [Object],
            activityType: 56
        },
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1651074369900',
            name: 'Joggen am Nachmittag',
            description: '',
            startTimeMillis: '1651074369951',
            endTimeMillis: '1651075989977',
            modifiedTimeMillis: '1651076017523',
            application: [Object],
            activityType: 56
        },
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1651309737735',
            name: 'Joggen am Mittag',
            description: '',
            startTimeMillis: '1651309737785',
            endTimeMillis: '1651311514256',
            modifiedTimeMillis: '1651319557875',
            application: [Object],
            activityType: 56
        },
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1651675028171',
            name: 'Joggen am Nachmittag',
            description: '',
            startTimeMillis: '1651675028229',
            endTimeMillis: '1651676521345',
            modifiedTimeMillis: '1651683954022',
            application: [Object],
            activityType: 56
        },
        {
            id: '351cccd5bd4e25e7:activemode:running.jogging:1651839875242',
            name: 'Joggen am Nachmittag',
            description: '',
            startTimeMillis: '1651839875279',
            endTimeMillis: '1651841513228',
            modifiedTimeMillis: '1651843590448',
            application: [Object],
            activityType: 56
        }
    ],
    deletedSession: []
};


