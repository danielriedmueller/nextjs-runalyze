import IRun from "./IRun";
import {Dayjs, OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import IDateFilter from "./IDateFilter";

export default interface IRuns {
    runs: IRun[];
    distanceSum: number;
    durationSum: Duration;
    vdotSum: number;
    stepsSum: number;
    caloriesSum: number;
    getCount: () => number;
    getNewest: () => IRun;
    getFirst: () => IRun;
    renderDistanceSum: () => string;
    renderDistanceAvg: () => string;
    getVdotAvg: () => string;
    getDurationSum: () => string;
    getDurationAvg: () => string;
    getPaceAvg: () => string;
    getStepsSum: () => string;
    getStepsAvg: () => string;
    getCaloriesSum: () => string;
    getCaloriesAvg: () => string;
    getBetween: (startDate: Dayjs, endDate: Dayjs) => IRuns;
    getFiltered: (filter: IDateFilter, period?: OpUnitType) => IRuns;
    toArray: () => IRun[];
}
