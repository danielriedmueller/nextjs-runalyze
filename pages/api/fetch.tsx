import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import ApiRun, {FITNESS_DATA_TYPES} from "../../model/ApiRun";

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req: Request, res: Response): Promise<ApiRun[]> {
    await cors(req, res);

    const {token} = req.body;

    const activityType = process.env.GOOGLE_API_ACTIVITY_TYPE_RUNNING;
    const startTime = '1970-01-01T00:00:00.000Z';
    const params = new URLSearchParams({activityType, startTime});
    const gApiResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    const gApiData = await gApiResponse.json();
    console.log(gApiData)

    let apiRuns = [];

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
            const apiRun = await ApiRun.fromGoogleApiData(gApiBucketData.bucket[0]);

            apiRuns.push(apiRun);
        })
    );

    return res.json(apiRuns);
}
