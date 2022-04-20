import {IDbRun} from "../interfaces/IDbRun";
import {fetchVdot} from "../pages/api/vdot";
import {IRun} from "../interfaces/IRun";
import {calcEndTime, dateToStartTime} from "../helper/functions";
import {IEditRun} from "../interfaces/IEditRun";

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

export class DbRun implements IDbRun {
    id?: number;
    calories: number;
    distance: number;
    endTime: number;
    startTime: number;
    steps: number;
    vdot: number;

    private constructor(startTime: number, endTime: number, distance: number, calories: number, steps: number, vdot: number) {
        this.calories = calories;
        this.distance = distance;
        this.endTime = endTime;
        this.startTime = startTime;
        this.steps = steps;
        this.vdot = vdot;
    }

    static async fromEditRun(run: IEditRun): Promise<IDbRun> {
        const startTime = dateToStartTime(run.date + " " +  run.time);
        const endTime = calcEndTime(startTime, run.duration);
        return new DbRun(
            startTime,
            endTime,
            parseFloat(run.distance),
            parseFloat(run.calories),
            parseFloat(run.steps),
            await fetchVdot(parseFloat(run.distance), startTime, endTime)
        );
    }

    static async fromGoogleApiData(bucket): Promise<IDbRun> {
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

    static async fromRun(run: IRun): Promise<IDbRun> {
        const startTime = dateToStartTime(run.date);
        const endTime = calcEndTime(startTime, run.duration);
        let newRun = new DbRun(
            startTime,
            endTime,
            run.distance,
            run.calories,
            run.steps,
            await fetchVdot(run.distance, startTime, endTime)
        );

        if (run.id) {
            newRun.id = run.id
        }

        return newRun;
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

    isNew = (): boolean => !this.id;
}
