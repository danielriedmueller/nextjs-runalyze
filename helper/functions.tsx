import dayjs from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {IDateFilter} from "../interfaces/IRuns";

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
 * year;month;week
 * e.g.
 * 2022;12;44 or 2022;12 or 2022
 */
export const dateFilterToCookieString = (filter: IDateFilter): string => {
    if (!filter) return '';

    const {year, month, week} = filter;
    let filterArr = [];

    if (year) {
        filterArr.push(year);
    }

    if (month) {
        filterArr.push(month);
    }

    if (week) {
        filterArr.push(week);
    }

    return filterArr.join(';');
}

export const cookieStringToDateFilter = (filterString: string): IDateFilter => {
    let dateFilter = {
        year: null,
        month: null,
        week: null
    };

    filterString.split(';').forEach((value, index) => {
        if (index === 0) {
            dateFilter.year = value;
        }

        if (index === 1) {
            dateFilter.month = value;
        }

        if (index === 2) {
            dateFilter.week = value;
        }
    })

    return dateFilter;
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
