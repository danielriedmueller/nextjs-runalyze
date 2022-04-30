import IRuns from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";
import {applyPeriodOnFilter, createDuration, durationToString, stringToDuration} from "../helper/functions";
import dayjs, {OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {Length, Pacer, Timespan} from "fitness-js";
import IDateFilter from "../interfaces/IDateFilter";
import {applyTrends} from "../helper/runs";
import ZeroRuns from "./ZeroRuns";
import IDbRun from "../interfaces/IDbRun";

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

        if (period) {
            filter = applyPeriodOnFilter(filter, period);
        } else {
            period = filter.week ? 'week' : filter.month ? 'month' : 'year';
        }

        let date;
        if (filter.week) {
            date = dayjs(filter.month + '-01-' + filter.year).week(filter.week);
        } else if (filter.month) {
            date = dayjs(filter.month + '-01-' + filter.year);
        } else {
            date = dayjs('01-01-' + filter.year);
        }

        const filteredRuns = this.getBetween(
            date.startOf(period),
            date.endOf(period)
        );

        applyTrends(filteredRuns);

        return filteredRuns;
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
        return this.runs[0];
    }

    getLatest(): IRun {
        return this.runs[this.getCount() - 1];
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
