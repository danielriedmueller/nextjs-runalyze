import IRuns from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";
import dayjs from "dayjs";
import IDateFilter from "../interfaces/IDateFilter";
import { Duration } from "dayjs/plugin/duration";

export default class ZeroRuns implements IRuns {
    distanceSum: number;
    durationSum: plugin.Duration;
    vdotSum: number;
    stepsSum: number;
    caloriesSum: number;
    runs: IRun[];

    constructor() {
        this.runs = [];
    }

    vdots: number[];
    steps: number[];
    calories: number[];
    getVdotMed: () => string;
    getStepsMed: () => string;
    getCaloriesMed: () => string;

    durations: Duration[];
    getDurationMed: () => string;

    distances: number[];
    renderDistanceMed: () => string;

    getBetween(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): IRuns {
        return undefined;
    }

    getFiltered(filter: IDateFilter, period: dayjs.OpUnitType | undefined): IRuns {
        return new ZeroRuns();
    }

    getCount(): number {
        return 0;
    }

    getFirst(): IRun {
        return undefined;
    }

    getNewest(): IRun {
        return undefined;
    }
    
    getDurationAvg = () => "-";
    getDurationSum = () => "-";
    getStepsSum = () => "-";
    getStepsAvg = () => "-";
    getCaloriesSum = () => "-";
    getCaloriesAvg = () => "-";
    getPaceAvg = () => "-";
    getVdotAvg = () => "-";
    renderDistanceAvg = () => "-";
    renderDistanceSum = () => "-";

    toArray(): IRun[] {
        return [];
    }

    getPaceMed(): string {
        return "";
    }
}
