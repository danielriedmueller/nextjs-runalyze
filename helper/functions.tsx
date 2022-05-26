import dayjs, {OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import IDateFilter from "../interfaces/IDateFilter";
import IRuns from "../interfaces/IRuns";
import Runs from "../model/Runs";
import Run from "../model/Run";
import {fetchRuns} from "./fetch";

export const createRuns = async (userId: string): Promise<IRuns> => {
    let runs = await fetchRuns(userId);
    return Runs.fromRuns(runs.map((run) => Run.fromDbRun(run)))
}

export const createDuration = (startTime: number, endTime: number): Duration => dayjs.duration(endTime - startTime);
export const durationToString = (duration: Duration): string => Math.floor(duration.asHours()) + ":" + duration.minutes() + ":" + duration.seconds();
export const stringToDuration = (duration: string): Duration => {
    let [seconds, minutes, hours] = duration.split(":").reverse().map((str) => parseInt(str));

    return dayjs.duration({
        seconds: seconds || 0,
        minutes: minutes || 0,
        hours: hours || 0
    });
};
export const calcEndTime = (startTime: number, duration: Duration): number => duration.asMilliseconds() + startTime;
export const dateToStartTime = (date: string): number => dayjs(date).valueOf();

/**
 * Adjujst invalid date filter
 * e.g. month without year
 */
export const emendDateFilter = (filter: IDateFilter): IDateFilter => {
    if (!filter.year) {
        filter.month = null;
    }

    if (!filter.month) {
        filter.week = null;
    }

    return filter;
}

export const applyPeriodOnFilter = (orgFilter: IDateFilter, period?: OpUnitType): IDateFilter => {
    let filter = {...orgFilter};

    if (period === 'year') {
        filter.month = null;
        filter.week = null;
    }

    if (period === 'month') {
        filter.week = null;
    }

    return filter;
}

export const median = (values) => {
    if(values.length === 0) throw new Error("No inputs");

    values.sort(function(a,b){
        return a-b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];

    return (values[half - 1] + values[half]) / 2.0;
}
