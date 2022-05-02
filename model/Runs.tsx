import IRuns from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";
import {applyPeriodOnFilter, durationToString, stringToDuration} from "../helper/functions";
import dayjs, {OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {Length, Pacer, Timespan} from "fitness-js";
import IDateFilter from "../interfaces/IDateFilter";
import ZeroRuns from "./ZeroRuns";
import {applyTrends} from "../helper/trends";
import {getMonthRuns, getWeekRuns, getYearRuns} from "../helper/filteredRuns";

export default class Runs implements IRuns {
    runs: IRun[];
    distanceSum: number;
    durationSum: Duration;
    vdotSum: number;

    private constructor(runs: IRun[]) {
        this.distanceSum = 0;
        this.durationSum = dayjs.duration(0);
        this.vdotSum = 0;

        runs.forEach((run) => {
            this.distanceSum += run.distance;
            this.durationSum = this.durationSum.add(run.duration);
            this.vdotSum += run.vdot;
        })

        this.runs = runs;
    }

    public static fromRuns(runs: IRun[]): IRuns {
        return runs.length > 0 ? new Runs(runs) : new ZeroRuns();
    }

    getFiltered(filter: IDateFilter, period?: OpUnitType): IRuns {
        if (!filter.year) {
            return this;
        }

        filter = applyPeriodOnFilter(filter, period);

        if (filter.week && filter.month) {
            return getWeekRuns(this, filter.week, filter.month, filter.year);
        }

        if (filter.month) {
            return getMonthRuns(this, filter.month, filter.year);
        }

        return getYearRuns(this, filter.year);
    }

    getFastest(): IRun {
        let run = this.runs.reduce((prev, current) => {
            const durationA = stringToDuration(prev.getPace());
            const durationB = stringToDuration(current.getPace());

            return (durationA.asMilliseconds() < durationB.asMilliseconds()) ? prev : current
        });
        run.best.push('fastest');

        return run;
    }

    getFurthest(): IRun {
        let run = this.runs.reduce((prev, current) => (prev.distance > current.distance) ? prev : current);
        run.best.push('furthest');

        return run;
    }

    getLongest(): IRun {
        let run = this.runs.reduce((prev, current) => (prev.duration.asMilliseconds() > current.duration.asMilliseconds()) ? prev : current);
        run.best.push('longest');

        return run;
    }

    getMostPerformant(): IRun {
        let run = this.runs.reduce((prev, current) => {
            return prev.vdot > current.vdot ? prev : current;
        });
        run.best.push('mostPerformant');

        return run;
    }

    getCount(): number {
        return this.runs.length;
    }

    getBetween(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): IRuns {
        return Runs.fromRuns(
            this.runs.filter((run) => run.date.isBetween(startDate, endDate, null, '[]'))
        );
    }

    renderDistanceAvg(): string {
        return ((Math.round((this.distanceSum / this.getCount()) * 100) / 100) / 1000).toFixed(2);
    }

    renderDistanceSum(): string {
        return (this.distanceSum / 1000).toFixed(2);
    }

    getDurationAvg(): string {
        return durationToString(dayjs.duration(this.durationSum.asMilliseconds() / this.getCount()));
    }

    getDurationSum(): string {
        return durationToString(this.durationSum);
    }

    getFirst(): IRun {
        return this.runs[this.getCount() - 1];
    }

    getNewest(): IRun {
        return this.runs[0];
    }

    getPaceAvg(): string {
        if (this.distanceSum === 0 || this.durationSum.asMilliseconds() === 0) {
            return "0:0";
        }

        return new Pacer()
            .withLength(new Length(this.distanceSum, 'm'))
            .withTime(new Timespan().addMilliseconds(this.durationSum.asMilliseconds()))
            .toPaceUnit('min/km').toString();
    }

    getVdotAvg(): string {
        return (this.vdotSum / this.getCount()).toFixed(2);
    }

    toArray(): IRun[] {
        return this.runs;
    }
}
