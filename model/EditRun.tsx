import {IEditRun} from "../interfaces/IEditRun";
import {IRun} from "../interfaces/IRun";
import dayjs from "dayjs";

export class EditRun implements IEditRun {
    date: string;
    distance: string;
    duration: string;
    time: string;
    calories?: string;
    id?: number;
    steps?: string;

    private constructor(date?: string, distance?: string, duration?: string, time?: string, calories?: string, steps?: string) {
        this.date = date;
        this.distance = distance;
        this.duration = duration;
        this.time = time;
        this.calories = calories;
        this.steps = steps;
    }

    public static create(): IEditRun {
        return new EditRun();
    }

    public static fromRun(run: IRun): IEditRun {
        const date = dayjs(run.date);

        return new EditRun(
            date.format('YYYY-MM-DD'),
            run.distance.toString(),
            run.duration,
            date.format('HH:MM:SS'),
            run.calories.toString(),
            run.steps.toString()
        );
    }
}