import dayjs from "dayjs";
import {Duration} from "dayjs/plugin/duration";

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

export const getDateRange = (range, deviation = 0) => {
    let date = dayjs(year + '-1', 'YYYY-M');
    if (range === "week") {
        date = date.week(deviation);
    } else {
        date = date.set(range, deviation);
    }

    return [
        date.clone().startOf(range),
        date.clone().endOf(range)
    ];
}

export const getRunsInTimeRange = (runs, range, deviation = 0) => {
    const dateRange = getDateRange(range, deviation);
    return getRunsBetween(runs, dateRange);
};

export const splitRunsInMonths = (runs) => {
    let months = {};
    runs.forEach(run => {
        let currentMonth = run.date.format('M');

        if (!(currentMonth in months)) {
            months[currentMonth] = [];
        }

        months[currentMonth].push(run);
    })

    return months;
}
