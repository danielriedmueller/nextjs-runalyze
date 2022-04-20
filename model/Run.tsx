import dayjs from "dayjs";
import {createDuration} from "../helper/functions";
import IRun from "../interfaces/IRun";
import IDbRun from "../interfaces/IDbRun";
import {Length, Pacer, Timespan} from "fitness-js";
import {Duration} from "dayjs/plugin/duration";

export class Run implements IRun {
    id: number;
    calories: number;
    date: string;
    distance: number;
    duration: Duration;
    steps: number;
    vdot: number;

    constructor(calories: number, date: string, distance: number, duration: Duration, steps: number, vdot: number, id: number) {
        this.calories = calories;
        this.date = date;
        this.distance = distance;
        this.duration = duration;
        this.steps = steps;
        this.vdot = vdot;
        this.id = id;
    }

    public static fromDbRun(dbRun: IDbRun): IRun {
        return new Run(
            dbRun.calories,
            dayjs(dbRun.startTime).format(process.env.NEXT_PUBLIC_DATE_FORMAT),
            dbRun.distance,
            createDuration(dbRun.startTime, dbRun.endTime),
            dbRun.id,
            dbRun.steps,
            dbRun.vdot
        );
    }

    getDateDay = (): string => dayjs(this.date).format('dddd');

    getPace = (): string => {
        if (this.distance === 0 || this.duration.asMilliseconds() === 0) {
            return "0:0";
        }
        return new Pacer()
            .withLength(new Length(this.distance, 'm'))
            .withTime(new Timespan().addMilliseconds(this.duration.asMilliseconds()))
            .toPaceUnit('min/km').toString();
    }

    getDuration = (): string => {
        return Math.floor(this.duration.asHours()) + ":" + this.duration.minutes() + ":" + this.duration.seconds()
    }
}