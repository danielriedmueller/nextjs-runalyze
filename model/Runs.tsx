import IRuns, {IDateFilter} from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";
import {durationToString, stringToDuration} from "../helper/functions";
import dayjs from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {Length, Pacer, Timespan} from "fitness-js";

export default class Runs implements IRuns {
    runs: IRun[];
    distanceSum: number;
    durationSum: Duration;
    vdotSum: number;
    filter: IDateFilter;

    constructor(runs: IRun[], filter: IDateFilter) {
        this.distanceSum = 0;
        this.durationSum = dayjs.duration();
        this.vdotSum = 0;
        this.filter = filter;

        runs.forEach((run) => {
            this.distanceSum += run.distance;
            this.durationSum.add(run.duration);
            this.vdotSum += run.vdot;
        })

        this.runs = runs;
    }

    getFiltered(): IRuns {
        if (!this.filter.year) {
            return this;
        }

        let date;
        let period;

        if (this.filter.week) {
            period = 'week';
            date = dayjs(this.filter.month + '-01-' + this.filter.year).week(this.filter.week);
        } else if (this.filter.month) {
            period = 'month';
            date = dayjs(this.filter.month + '-01-' + this.filter.year);
        } else {
            period = 'year';
            date = dayjs('01-01-' + this.filter.year);
        }

        return this.getBetween(
            date.startOf(period),
            date.endOf(period)
        );
    }

    getFastest(): IRun {
        let run = this.runs.reduce((prev, current) => {
            const durationA = stringToDuration(prev.getPace());
            const durationB = stringToDuration(current.getPace());

            return (durationA.asMilliseconds() < durationB.asMilliseconds()) ? prev : current
        });
        run.best = 'fastest';

        return run;
    }

    getFurthest(): IRun {
        let run = this.runs.reduce((prev, current) => (prev.distance > current.distance) ? prev : current);
        run.best = 'furthest';

        return run;
    }

    getLongest(): IRun {
        let run = this.runs.reduce((prev, current) => (prev.duration.asMilliseconds() > current.duration.asMilliseconds()) ? prev : current);
        run.best = 'longest';

        return run;
    }

    getMostPerformant(): IRun {
        let run = this.runs.reduce((prev, current) => {
            return prev.vdot > current.vdot ? prev : current;
        });
        run.best = 'mostPerformant';

        return run;
    }

    getCount(): number {
        return this.runs.length;
    }

    getBetween(startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): IRuns {
        return new Runs(
            this.runs.filter((run) => run.date.isBetween(startDate, endDate, null, '[]')),
            this.filter
        );
    }

    getDistanceAvg(): number {
        return (Math.round((this.distanceSum / this.getCount()) * 100) / 100);
    }

    getDistanceSum(): number {
        return this.distanceSum;
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
}
