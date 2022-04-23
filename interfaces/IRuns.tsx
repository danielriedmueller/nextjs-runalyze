import IRun from "./IRun";
import {Dayjs} from "dayjs";
import {Duration} from "dayjs/plugin/duration";

export default interface IRuns {
    runs: IRun[];
    filter: IDateFilter;
    distanceSum: number;
    durationSum: Duration;
    vdotSum: number;
    getMostPerformant: () => IRun;
    getFurthest: () => IRun;
    getLongest: () => IRun;
    getFastest: () => IRun;
    getCount: () => number;
    getLatest: () => IRun;
    getFirst: () => IRun;
    getDistanceSum: () => number;
    getDistanceAvg: () => number;
    getVdotAvg: () => string;
    getDurationSum: () => string;
    getDurationAvg: () => string;
    getPaceAvg: () => string;
    getBetween: (startDate: Dayjs, endDate: Dayjs) => IRuns;
    getFiltered: () => IRuns;
}

export interface IDateFilter {
    year: number;
    month: number;
    week: number;
}
