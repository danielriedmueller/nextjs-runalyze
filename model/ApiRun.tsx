import IApiRun from "../interfaces/IApiRun";

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

export default class ApiRun implements IApiRun {
    calories: number;
    distance: number;
    endTime: number;
    startTime: number;
    steps: number;

    private constructor(
        startTime: number,
        endTime: number,
        distance: number,
        calories: number,
        steps: number,
    ) {
        this.calories = calories;
        this.distance = distance;
        this.endTime = endTime;
        this.startTime = startTime;
        this.steps = steps;
    }

    static async fromGoogleApiData(bucket): Promise<IApiRun> {
        const {distance, calories, steps} = ApiRun.getFitnessDataFromDataset(bucket.dataset);

        return new ApiRun(
            parseInt(bucket.session.startTimeMillis),
            parseInt(bucket.session.endTimeMillis),
            distance,
            calories,
            steps
        );
    }

    static getFitnessDataFromDataset = (datasets): FitnessData => {
        let fitnessData = [];

        datasets.forEach((dataset) => {
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
