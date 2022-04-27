import IRun from "./IRun";
import {Dayjs, OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import IDateFilter from "./IDateFilter";

export default interface IRuns {
    runs: IRun[];
    distanceSum: number;
    durationSum: Duration;
    getFurthest: () => IRun;
    getLongest: () => IRun;
    getFastest: () => IRun;
    getCount: () => number;
    getLatest: () => IRun;
    getFirst: () => IRun;
    getDistanceSum: () => number;
    getDistanceAvg: () => number;
    getDurationSum: () => string;
    getDurationAvg: () => string;
    getPaceAvg: () => string;
    getBetween: (startDate: Dayjs, endDate: Dayjs) => IRuns;
    getFiltered: (filter: IDateFilter, period?: OpUnitType) => IRuns;
    toArray: () => IRun[];
}
