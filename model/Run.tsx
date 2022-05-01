import dayjs, {Dayjs} from "dayjs";
import {createDuration, durationToString} from "../helper/functions";
import IRun from "../interfaces/IRun";
import IDbRun from "../interfaces/IDbRun";
import {Length, Pacer, Timespan} from "fitness-js";
import {Duration} from "dayjs/plugin/duration";

export default class Run implements IRun {
    id: number;
    calories: number;
    date: Dayjs;
    distance: number;
    duration: Duration;
    steps: number;
    vdot: number;
    best: string[];
    paceTrend: string;
    distanceTrend: string;
    vdotTrend: string;
    durationTrend: string;
    isCurrent: boolean;

    private constructor(calories: number, date: string, distance: number, duration: Duration, steps: number, vdot: number, id: number) {
        this.calories = calories;
        this.date = dayjs(date);
        this.distance = distance;
        this.duration = duration;
        this.steps = steps;
        this.vdot = vdot;
        this.id = id;
        this.best = [];
        this.isCurrent = false;
    }

    public static fromDbRun(dbRun: IDbRun): IRun {
        return new Run(
            dbRun.calories,
            dayjs(dbRun.startTime).format(process.env.NEXT_PUBLIC_DATE_FORMAT),
            dbRun.distance,
            createDuration(dbRun.startTime, dbRun.endTime),
            dbRun.steps,
            dbRun.vdot,
            dbRun.id
        );
    }

    renderDistance = (): string => (this.distance / 1000).toFixed(2);

    getDate = ():string => this.date.format(process.env.NEXT_PUBLIC_DATE_FORMAT);

    getDateDay = (): string => this.date.format('dddd');

    getPace = (): string => {
        if (this.distance === 0 || this.duration.asMilliseconds() === 0) {
            return "0:0";
        }
        return new Pacer()
            .withLength(new Length(this.distance, 'm'))
            .withTime(new Timespan().addMilliseconds(this.duration.asMilliseconds()))
            .toPaceUnit('min/km').toString();
    }

    getDuration = (): string => durationToString(this.duration);

    renderCalories = (): string => this.calories.toFixed(0);
}
