import dayjs, {OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import IDateFilter from "../interfaces/IDateFilter";
import exp from "constants";

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

export const applyPeriodOnFilter = (orgFilter: IDateFilter, period: OpUnitType): IDateFilter => {
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


export const isValidRun = (newRun) => {
    let code, i, len;

    const distance = newRun.distance;
    const duration = newRun.duration;

    if (!distance || !duration) return false;

    if (parseFloat(distance) === 0) {
        return false;
    }

    let hasPositiveValue = false;
    duration.split(":").forEach(char => {
        if (parseInt(char) !== 0) {
            hasPositiveValue = true;
        }
    });
    if (!hasPositiveValue) {
        return false;
    }

    for (i = 0, len = distance.length; i < len; i++) {
        code = distance.charCodeAt(i);
        if (!(code > 47 && code < 58) && code !== 46) {
            return false;
        }
    }

    for (i = 0, len = duration.length; i < len; i++) {
        code = duration.charCodeAt(i);
        if (!(code > 47 && code < 58) && code !== 58) {
            return false;
        }
    }

    return true;
}
