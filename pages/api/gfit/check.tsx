import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";
import {fetchSessions} from "./fetch";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req: Request, res: Response): Promise<number> {
    await cors(req, res);

    const {token, user} = req.body;

    const sessions = [];

    const gApiData = await fetchSessions(user, token);

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

    return res.json(sessions.length);
}
