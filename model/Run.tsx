import {IRun} from "../interfaces/IRun";
import {IDbRun} from "../interfaces/IDbRun";
import dayjs from "dayjs";
import {createDuration, durationToString} from "../helper/functions";

export class Run implements IRun {
    calories: number;
    date: string;
    distance: number;
    duration: string;
    steps: number;
    vdot: number;

    private constructor(calories: number, date: string, distance: number, duration: string, steps: number, vdot: number) {
        this.calories = calories;
        this.date = date;
        this.distance = distance;
        this.duration = duration;
        this.steps = steps;
        this.vdot = vdot;
    }

    public static fromDbRun(dbRun: IDbRun): IRun {
        return new Run(
            dbRun.calories,
            dayjs(dbRun.startTime).format(process.env.NEXT_PUBLIC_DATE_FORMAT),
            dbRun.distance,
            durationToString(createDuration(dbRun.startTime, dbRun.endTime)),
            dbRun.steps,
            dbRun.vdot
        );
    }
}