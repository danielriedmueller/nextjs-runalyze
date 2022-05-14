import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";
import DbRun, {FITNESS_DATA_TYPES} from "../../../model/DbRun";
import {insertRun} from "../insert";

const cors = initMiddleware(
    Cors({
        methods: ['POST'],
    })
)

export default async function handle(req: Request, res: Response): Promise<boolean> {
    await cors(req, res);

    const {token, user, session} = req.body;

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

    res.json(true)
}
