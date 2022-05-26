import IRuns from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";
import {applyPeriodOnFilter, durationToString, median} from "../helper/functions";
import dayjs, {OpUnitType} from "dayjs";
import {Duration} from "dayjs/plugin/duration";
import {Length, Pacer, Timespan} from "fitness-js";
import IDateFilter from "../interfaces/IDateFilter";
import ZeroRuns from "./ZeroRuns";
import {getMonthRuns, getWeekRuns, getYearRuns} from "../helper/filteredRuns";

export default class Runs implements IRuns {
    runs: IRun[];
    distanceSum: number;
    distances: number[];
    durationSum: Duration;
    vdotSum: number;
    caloriesSum: number;
    stepsSum: number;
    durations: Duration[];
    calories: number[];
    steps: number[];
    vdots: number[];

    private constructor(runs: IRun[]) {
        this.distanceSum = 0;
        this.durationSum = dayjs.duration(0);
        this.vdotSum = 0;
        this.caloriesSum = 0;
        this.stepsSum = 0;
        this.distances = [];
        this.durations = [];
        this.vdots = [];
        this.steps = [];
        this.calories = [];

        runs.forEach((run) => {
            this.distanceSum += run.distance;
            this.distances.push(run.distance);
            this.durationSum = this.durationSum.add(run.duration);
            this.durations.push(run.duration);
            this.vdotSum += run.vdot;
            this.vdots.push(run.vdot);
            this.stepsSum += run.steps;
            this.steps.push(run.steps);
            this.caloriesSum += run.calories;
            this.calories.push(run.calories);
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
    getStepsSum = () => this.stepsSum.toFixed(0);
    getStepsAvg = () => (this.stepsSum / this.getCount()).toFixed(0);
    getStepsMed = () => (median(this.steps)).toFixed(0);
    getCaloriesSum = () => this.caloriesSum.toFixed(0);
    getCaloriesAvg = () => (this.caloriesSum / this.getCount()).toFixed(0);
    getCaloriesMed = () => (median(this.calories)).toFixed(0);
    getPaceAvg = () => {
        if (this.distanceSum === 0 || this.durationSum.asMilliseconds() === 0) {
            return "0:0";
        }

        return new Pacer()
            .withLength(new Length(this.distanceSum, 'm'))
            .withTime(new Timespan().addMilliseconds(this.durationSum.asMilliseconds()))
            .toPaceUnit('min/km').toString();
    }
    getPaceMed = () => {
        if (this.distanceSum === 0 || this.durationSum.asMilliseconds() === 0 || this.durations.length === 0) {
            return "0:0";
        }

        return new Pacer()
            .withLength(new Length(median(this.distances), 'm'))
            .withTime(new Timespan().addMilliseconds(median(this.durations.map((duration) => duration.asMilliseconds()))))
            .toPaceUnit('min/km').toString();
    }
    getVdotAvg = () => ((this.vdotSum / this.getCount()).toFixed(2));
    getVdotMed = () => (median(this.vdots).toFixed(2));
    renderDistanceAvg = () => (((Math.round((this.distanceSum / this.getCount()) * 100) / 100) / 1000).toFixed(2));
    renderDistanceSum = () => (this.distanceSum / 1000).toFixed(2);
    renderDistanceMed = () => (median(this.distances) / 1000).toFixed(2);
    getDurationAvg = () => durationToString(dayjs.duration(this.durationSum.asMilliseconds() / this.getCount()));
    getDurationSum = () => durationToString(this.durationSum);
    getDurationMed = () => durationToString(dayjs.duration(median(this.durations.map((duration) => duration.asMilliseconds()))));
}
