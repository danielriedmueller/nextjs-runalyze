import dayjs from "dayjs";

import {Pacer, Length, Timespan} from "fitness-js";

export const jsonToRuns = (json) => json.map(({Date, Distance, Duration}) => {
    return {
        date: dayjs(Date),
        distance: parseFloat(Distance),
        duration: stringToDuration(Duration)
    }
})

export const isValidRun = (newRun) => {
    let code, i, len;

    const distance = newRun.distance;
    const duration = newRun.duration;

    if (!distance || !duration) return false;

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

export const stringToDuration = (str) => {
    let [seconds, minutes, hours] = str.split(":").reverse().map((str) => parseInt(str));

    return dayjs.duration({
        seconds: seconds || 0,
        minutes: minutes || 0,
        hours: hours || 0
    });
}

export const durationToString = (duration) =>
    Math.floor(duration.asHours()) + ":" + duration.minutes() + ":" + duration.seconds();

export const combineRuns = (runs) => {
    if (runs.length === 0) return null;

    let duration = dayjs.duration({'hours': 0});
    let distance = 0;

    runs.forEach((run) => {
        distance += parseFloat(run.distance);
        duration = duration.add(run.duration);
    })

    return {
        runs: runs.length,
        distance: (Math.round(distance * 100)/100),
        avgDistance: (Math.round((distance / runs.length) * 100)/100),
        duration: duration,
        avgDuration: dayjs.duration(duration.asMilliseconds() /  runs.length)
    };
}

export const getDateRange = (range, year, deviation = 0) => {
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

export const getRunsInTimeRange = (runs, range, year, deviation = 0) => {
    const dateRange = getDateRange(range, year, deviation);
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
    const durationA = stringToDuration(calcPace(prev.distance, prev.duration));
    const durationB = stringToDuration(calcPace(current.distance, current.duration));

    return (durationA.asMilliseconds() / prev.distance) < (durationB.asMilliseconds() / current.distance) ? prev : current;
});

export const calcPace = (distance, duration) => new Pacer()
    .withLength(new Length(distance, 'km'))
    .withTime(new Timespan().addMilliseconds(duration.asMilliseconds()))
    .toPaceUnit('min/km').toString();

export const filterRuns = (runs, filter) => {
    let {year, month, week} = filter;

    if (!year && !month && !week) return runs;

    if (!year) {
        year = dayjs().year();
    }
    let date = dayjs(year + "-1", "YYYY-M");

    if (week) {
        date = date.week(week);

        return getRunsBetween(runs, [
            date.clone().startOf('week'),
            date.clone().endOf('week')
        ])
    }

    if (month) {
        date = date.month(month - 1);

        return getRunsBetween(runs, [
            date.clone().startOf('month'),
            date.clone().endOf('month')
        ])
    }

    return getRunsBetween(runs, [
        date.clone().startOf('year'),
        date.clone().endOf('year')
    ])
}