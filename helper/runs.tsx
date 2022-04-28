import IRuns from "../interfaces/IRuns";
import IRun from "../interfaces/IRun";

const SINGLE_DOWN_CLS = 'singleDown';
const DOUBLE_DOWN_CLS = 'doubleDown';
const SINGLE_UP_CLS = 'singleUp';
const DOUBLE_UP_CLS = 'doubleUp';

export const applyTrends = (runs: IRuns): IRuns => {
    const runsCount = runs.getCount();
    const avgPace = (runs.distanceSum) / runs.durationSum.asMilliseconds();
    const avgDuration = runs.durationSum.asMilliseconds() / runsCount;
    const avgDistance = runs.distanceSum / runsCount;
    const avgVdot = runs.vdotSum / runsCount;

    runs.runs.forEach(run => {
        run.paceTrend = calcPaceTrend(run, avgPace);
        run.durationTrend = calcDurationTrend(run, avgDuration);
        run.distanceTrend = calcDistanceTrend(run, avgDistance);
        run.vdotTrend = calcVdotTrend(run, avgVdot);
    })

    return runs;
}

const calcPaceTrend = (run: IRun, avg: number): string => {
    let trend = '';
    const pace = run.distance / run.duration.asMilliseconds();
    const deviation = (avg - pace) * 10000;

    if (deviation > 5) {
        if (deviation > 10) {
            trend = DOUBLE_UP_CLS;
        } else {
            trend = SINGLE_UP_CLS;
        }
    }

    if (deviation < 5) {
        if (deviation < 10) {
            trend = DOUBLE_DOWN_CLS;
        } else {
            trend = SINGLE_DOWN_CLS;
        }
    }

    return trend;
}

const calcDurationTrend = (run: IRun, avg: number): string => {
    let trend = '';
    const duration = run.duration.asMilliseconds();
    const deviation = (avg - duration);

    if (deviation > 5) {
        if (deviation > 10) {
            trend = DOUBLE_UP_CLS;
        } else {
            trend = SINGLE_UP_CLS;
        }
    }

    if (deviation < 5) {
        if (deviation < 10) {
            trend = DOUBLE_DOWN_CLS;
        } else {
            trend = SINGLE_DOWN_CLS;
        }
    }

    return trend;
}