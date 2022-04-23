import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req: Request, res: Response): Promise<number> {
    await cors(req, res);

    const {token, user} = req.body;

    let latestRunDate = db.prepare('SELECT startTime FROM runs WHERE user = ? ORDER BY startTime desc').pluck().get(user);
    const activityType = process.env.GOOGLE_API_ACTIVITY_TYPE_RUNNING;
    const params = new URLSearchParams({activityType, latestRunDate});
    const gApiResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const gApiData = await gApiResponse.json();

    return res.json(gApiData.session.length);
}
