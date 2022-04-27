import dayjs, {Dayjs} from "dayjs";
import {createDuration, durationToString} from "../helper/functions";
import IRun from "../interfaces/IRun";
import {Length, Pacer, Timespan} from "fitness-js";
import {Duration} from "dayjs/plugin/duration";
import IApiRun from "../interfaces/IApiRun";

export default class Run implements IRun {
    calories: number;
    date: Dayjs;
    distance: number;
    duration: Duration;
    steps: number;
    best: string[];

    constructor(calories: number, date: string, distance: number, duration: Duration, steps: number) {
        this.calories = calories;
        this.date = dayjs(date);
        this.distance = distance;
        this.duration = duration;
        this.steps = steps;
        this.best = [];
    }

    public static fromApiRun(apiRun: IApiRun): IRun {
        return new Run(
            apiRun.calories,
            dayjs(apiRun.startTime).format(process.env.NEXT_PUBLIC_DATE_FORMAT),
            apiRun.distance,
            createDuration(apiRun.startTime, apiRun.endTime),
            apiRun.steps
        );
    }

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
}
