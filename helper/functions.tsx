import dayjs from "dayjs";


import {Duration} from "dayjs/plugin/duration";

export const createDuration = (startTime: number, endTime: number): Duration => dayjs.duration(endTime - startTime);
export const stringToDuration = (duration: string): Duration => {
    let [seconds, minutes, hours] = duration.split(":").reverse().map((str) => parseInt(str));

    return dayjs.duration({
        seconds: seconds || 0,
        minutes: minutes || 0,
        hours: hours || 0
    });
};
export const calcEndTime = (startTime: number, duration: string): number => stringToDuration(duration).asMilliseconds() + startTime;
export const dateToStartTime = (date: string): number => dayjs(date).valueOf();

export const jsonToRun = ({date, distance, duration, vdot, id}) => ({
    date: dayjs(date),
    distance: parseFloat(distance),
    duration: stringToDuration(duration),
    vdot: vdot,
    id: id
});

export const runToJson = ({date, distance, duration, id}) => ({
    date: date.format(process.env.NEXT_PUBLIC_DB_DATE_FORMAT),
    distance: distance,
    duration: durationToString(duration),
    id: id
});

export const runToEditRun = ({date, distance, duration, id}) => ({
    date: date.format('YYYY-MM-DD'),
    time: date.format('HH:mm:ss'),
    distance: distance.toString(),
    duration: durationToString(duration),
    id: id | null
});

export const jsonToRuns = (json) => json.map(jsonToRun);

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


export const combineRuns = (runs) => {
    if (runs.length === 0) return null;

    let duration = dayjs.duration({'hours': 0});
    let distance = 0
    let accumulatedVdot = 0;

    runs.forEach((run) => {
        distance += parseFloat(run.distance);
        duration = duration.add(run.duration);
        accumulatedVdot += run.vdot;
    })

    return {
        runs: runs.length,
        distance: (Math.round(distance * 100) / 100),
        avgDistance: (Math.round((distance / runs.length) * 100) / 100),
        duration: duration,
        avgDuration: dayjs.duration(duration.asMilliseconds() / runs.length),
        avgVdot: (accumulatedVdot / runs.length).toFixed(2)
    };
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

export const getRunsBetween = (runs, dateRange) => runs.filter((run) => run.date.isAfter(dateRange[0]) && run.date.isBefore(dateRange[1]));

export const findFastestRun = (runs) => runs.reduce((prev, current) => {
    const durationA = stringToDuration(calcPace(prev.distance, prev.duration));
    const durationB = stringToDuration(calcPace(current.distance, current.duration));
    return (durationA.asMilliseconds() < durationB.asMilliseconds()) ? prev : current
});

export const findLongestRun = (runs) => runs.reduce((prev, current) => (prev.duration.asMilliseconds() > current.duration.asMilliseconds()) ? prev : current);

export const findFurthestRun = (runs) => runs.reduce((prev, current) => (prev.distance > current.distance) ? prev : current);

export const findPerformanceRun = (runs) => runs.reduce((prev, current) => {
    return prev.vdot > current.vdot ? prev : current;
});



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
