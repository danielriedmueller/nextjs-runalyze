import initMiddleware from "../../../lib/init-middleware";
import Cors from "cors";
import DbRun, {FITNESS_DATA_TYPES} from "../../../model/DbRun";
import {insertRun} from "../insert";
import {NextApiRequest, NextApiResponse} from "next";
import {SyncType} from "../../../interfaces/IGoogleSession";
import {deleteRun} from "../delete";

const cors = initMiddleware(
    Cors({
        methods: ['POST'],
    })
)

export default async function handle(req: NextApiRequest, res: NextApiResponse<boolean>): Promise<void> {
    await cors(req, res);

    const {token, user, session} = req.body;

    if (session.syncType === SyncType.Delete) {
        await deleteRun(user, session.startTimeMillis, session.endTimeMillis);

        return res.send(true);
    }

    const fields = '?fields=bucket(startTimeMillis,endTimeMillis,dataset(point(dataTypeName,value(intVal,fpVal))))';


    const datasetResponse = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/dataset:aggregate' + fields, {
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
    const dataset = await datasetResponse.json() as IGoogleDatasetResponse;
    const dbRun = await DbRun.fromGoogleApiData(dataset);

    await insertRun(user, dbRun);


    return res.send(true);
}


export interface IGoogleDatasetResource {
    "minStartTimeNs": number,
    "maxEndTimeNs": number,
    "dataSourceId": string,
    "point": [
        {
            "startTimeNanos": number,
            "endTimeNanos": number,
            "dataTypeName": string,
            "originDataSourceId": string,
            "value": [
                {
                    "intVal": number,
                    "fpVal": number,
                    "stringVal": string,
                    "mapVal": [
                        {
                            "key": string,
                            "value": {
                                "fpVal": number
                            }
                        }
                    ]
                }
            ],
            "modifiedTimeMillis": number,
            "rawTimestampNanos": number,
            "computationTimeMillis": number
        }
    ],
    "nextPageToken": string
}


export interface IGoogleDatasetResponse {
    "bucket": [
        {
            "type": string,
            "startTimeMillis": number,
            "endTimeMillis": number,
            "dataset": IGoogleDatasetResource[],
            "session": {
                "id": string,
                "name": string,
                "description": string,
                "startTimeMillis": number,
                "endTimeMillis": number,
                "modifiedTimeMillis": number,
                "application": {
                    "packageName": string,
                    "version": string,
                    "detailsUrl": string,
                    "name": string
                },
                "activityType": number,
                "activeTimeMillis": number
            },
            "activity": number
        }
    ]
}
