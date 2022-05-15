import {fetchVdot} from "../pages/api/vdot";
import IDbRun from "../interfaces/IDbRun";
import {IGoogleDatasetResource, IGoogleDatasetResponse} from "../pages/api/gfit/fetch";

interface FitnessData {
    distance: number;
    steps: number;
    calories: number;
}

export const FITNESS_DATA_TYPES = {
    'distance': 'com.google.distance.delta',
    'steps': 'com.google.step_count.delta',
    'calories': 'com.google.calories.expended'
}

export default class DbRun implements IDbRun {
    id?: number;
    calories: number;
    distance: number;
    endTime: number;
    startTime: number;
    steps: number;
    vdot: number;

    private constructor(
        startTime: number,
        endTime: number,
        distance: number,
        calories: number,
        steps: number,
        vdot: number
    ) {
        this.calories = calories;
        this.distance = distance;
        this.endTime = endTime;
        this.startTime = startTime;
        this.steps = steps;
        this.vdot = vdot;
    }

    static async fromGoogleApiData(datasetResponse: IGoogleDatasetResponse): Promise<IDbRun> {
        const bucket = datasetResponse.bucket[0];
        const {distance, calories, steps} = DbRun.getFitnessDataFromDataset(bucket.dataset);

        return new DbRun(
            bucket.session.startTimeMillis,
            bucket.session.endTimeMillis,
            distance,
            calories,
            steps,
            await fetchVdot(distance, bucket.session.startTimeMillis, bucket.session.endTimeMillis)
        );
    }

    static getFitnessDataFromDataset = (datasetResources: IGoogleDatasetResource[]): FitnessData => {
        let fitnessData = [];

        datasetResources.forEach((dataset) => {
            dataset.point.forEach((point) => {
                Object.entries(FITNESS_DATA_TYPES).forEach(([type, apiName]) => {
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
}
