import dayjs from "dayjs";
import IRuns from "../interfaces/IRuns";

export const getWeekRuns = (runs: IRuns, week: number, month: number, year: number) => {
    const date = dayjs(month + '-01-' + year).week(week);

    let startOf = date.startOf('week');
    if (startOf.month() + 1 < month) {
       startOf = date.startOf('month');
    }

    let endOf = date.endOf('week');
    if (endOf.month() + 1 > month) {
        endOf = date.endOf('month');
    }

    return runs.getBetween(startOf, endOf);
}

export const getMonthRuns = (runs: IRuns, month: number, year: number) => {
    const date = dayjs(month + '-01-' + year);

    return runs.getBetween(date.startOf('month'), date.endOf('month'));
}

export const getYearRuns = (runs: IRuns, year: number) => {
    const date = dayjs('01-01-' + year);

    return runs.getBetween(date.startOf('year'), date.endOf('year'));
}
