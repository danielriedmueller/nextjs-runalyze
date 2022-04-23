import IRun from "./IRun";
import {Dayjs} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {IDateFilter} from "./IDateFilter";

export default interface IRuns {
    runs: IRun[];
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
    getFiltered: (filter: IDateFilter) => IRuns;
}