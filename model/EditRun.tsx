import dayjs from "dayjs";
import IEditRun from "../interfaces/IEditRun";
import IRun from "../interfaces/IRun";
import {durationToString} from "../helper/functions";

export default class EditRun implements IEditRun {
    date: string;
    distance: string;
    duration: string;
    calories?: string;
    id?: number;
    steps?: string;

    private constructor(id?: number, date?: string, distance?: string, duration?: string, calories?: string, steps?: string) {
        this.id = id;
        this.date = date;
        this.distance = distance;
        this.duration = duration;
        this.calories = calories;
        this.steps = steps;
    }

    public static create(): IEditRun {
        return new EditRun();
    }

    public static fromRun(run: IRun): IEditRun {
        const date = dayjs(run.date);

        return new EditRun(
            run.id,
            date.format('YYYY-MM-DDTHH:MM'),
            run.distance.toString(),
            durationToString(run.duration),
            run.calories.toString(),
            run.steps.toString()
        );
    }

    isValid(): boolean {
        return !!(this.date && this.distance && this.duration);
    }
}
