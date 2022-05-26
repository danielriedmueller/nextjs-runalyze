import IRun from "./IRun";
import {Dayjs, OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import IDateFilter from "./IDateFilter";

export default interface IRuns {
    runs: IRun[];
    distanceSum: number;
    distances: number[];
    durationSum: Duration;
    durations: Duration[];
    vdotSum: number;
    vdots: number[];
    stepsSum: number;
    steps: number[];
    caloriesSum: number;
    calories: number[];
    getCount: () => number;
    getNewest: () => IRun;
    getFirst: () => IRun;
    renderDistanceSum: () => string;
    renderDistanceAvg: () => string;
    renderDistanceMed: () => string;
    getVdotAvg: () => string;
    getVdotMed: () => string;
    getDurationSum: () => string;
    getDurationAvg: () => string;
    getDurationMed: () => string;
    getPaceAvg: () => string;
    getPaceMed: () => string;
    getStepsSum: () => string;
    getStepsAvg: () => string;
    getStepsMed: () => string;
    getCaloriesSum: () => string;
    getCaloriesAvg: () => string;
    getCaloriesMed: () => string;
    getBetween: (startDate: Dayjs, endDate: Dayjs) => IRuns;
    getFiltered: (filter: IDateFilter, period?: OpUnitType) => IRuns;
    toArray: () => IRun[];
}
