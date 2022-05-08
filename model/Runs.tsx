import IRuns from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";
import {applyPeriodOnFilter, durationToString} from "../helper/functions";
import dayjs, {OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {Length, Pacer, Timespan} from "fitness-js";
import IDateFilter from "../interfaces/IDateFilter";
import ZeroRuns from "./ZeroRuns";
import {getMonthRuns, getWeekRuns, getYearRuns} from "../helper/filteredRuns";

export default class Runs implements IRuns {
    runs: IRun[];
    distanceSum: number;
    durationSum: Duration;
    vdotSum: number;
    caloriesSum: number;
    stepsSum: number;

    private constructor(runs: IRun[]) {
        this.distanceSum = 0;
        this.durationSum = dayjs.duration(0);
        this.vdotSum = 0;
        this.caloriesSum = 0;
        this.stepsSum = 0;

        runs.forEach((run) => {
            this.distanceSum += run.distance;
            this.durationSum = this.durationSum.add(run.duration);
            this.vdotSum += run.vdot;
            this.stepsSum += run.steps;
            this.caloriesSum += run.calories;
        })

        this.runs = runs;
    }

    public static fromRuns(runs: IRun[]): IRuns {
        return runs.length > 0 ? new Runs(runs) : new ZeroRuns();
    }

    getFiltered = (filter: IDateFilter, period?: OpUnitType) => {
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
    getCount = () => this.runs.length;
    getBetween = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => Runs.fromRuns(
        this.runs.filter((run) => run.date.isBetween(startDate, endDate, null, '[]'))
    );
    getFirst = () => this.runs[this.getCount() - 1];
    getNewest = () => this.runs[0];
    toArray = () => this.runs;
    getDurationAvg = () => durationToString(dayjs.duration(this.durationSum.asMilliseconds() / this.getCount()));
    getDurationSum = () => durationToString(this.durationSum);
    getStepsSum = () => this.stepsSum.toFixed(0);
    getStepsAvg = () => (this.stepsSum / this.getCount()).toFixed(0);
    getCaloriesSum = () => this.caloriesSum.toFixed(0);
    getCaloriesAvg = () => (this.caloriesSum / this.getCount()).toFixed(0);
    getPaceAvg = () => {
        if (this.distanceSum === 0 || this.durationSum.asMilliseconds() === 0) {
            return "0:0";
        }

        return new Pacer()
            .withLength(new Length(this.distanceSum, 'm'))
            .withTime(new Timespan().addMilliseconds(this.durationSum.asMilliseconds()))
            .toPaceUnit('min/km').toString();
    }
    getVdotAvg = () => ((this.vdotSum / this.getCount()).toFixed(2));
    renderDistanceAvg = () => (((Math.round((this.distanceSum / this.getCount()) * 100) / 100) / 1000).toFixed(2));
    renderDistanceSum = () => (this.distanceSum / 1000).toFixed(2);
}
