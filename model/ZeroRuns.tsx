import IRuns from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";
import {applyPeriodOnFilter, durationToString, stringToDuration} from "../helper/functions";
import dayjs, {OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {Length, Pacer, Timespan} from "fitness-js";
import IDateFilter from "../interfaces/IDateFilter";
import {applyTrends} from "../helper/runs";

export default class ZeroRuns implements IRuns {
    distanceSum: number;
    durationSum: plugin.Duration;

    constructor() {
        this.distanceSum = 0;
        this.durationSum = dayjs.duration(0);
        this.vdotSum = 0;
        this.runs = [];
    }

    getBetween(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): IRuns {
        return undefined;
    }

    getCount(): number {
        return 0;
    }

    getDurationAvg(): string {
        return "-";
    }

    getDurationSum(): string {
        return "-";
    }

    getFastest(): IRun {
        return undefined;
    }

    getFiltered(filter: IDateFilter, period: dayjs.OpUnitType | undefined): IRuns {
        return new ZeroRuns();
    }

    getFirst(): IRun {
        return undefined;
    }

    getFurthest(): IRun {
        return undefined;
    }

    getNewest(): IRun {
        return undefined;
    }

    getLongest(): IRun {
        return undefined;
    }

    getMostPerformant(): IRun {
        return undefined;
    }

    getPaceAvg(): string {
        return "-";
    }

    getVdotAvg(): string {
        return "-";
    }

    renderDistanceAvg(): string {
        return "-";
    }

    renderDistanceSum(): string {
        return "-";
    }

    runs: IRun[];

    toArray(): IRun[] {
        return [];
    }

    vdotSum: number;
}
