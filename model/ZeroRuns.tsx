import IRuns from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";
import dayjs from "dayjs";
import IDateFilter from "../interfaces/IDateFilter";

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

    getFiltered(filter: IDateFilter, period: dayjs.OpUnitType | undefined): IRuns {
        return new ZeroRuns();
    }

    getFirst(): IRun {
        return undefined;
    }

    getNewest(): IRun {
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
