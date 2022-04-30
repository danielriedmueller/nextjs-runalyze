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

const calcPaceTrend = (run: IRun, avg: number): string => getTrendByDeviation((avg - run.distance / run.duration.asMilliseconds()) * 10000);
const calcDurationTrend = (run: IRun, avg: number): string => getTrendByDeviation(avg - run.duration.asMilliseconds());
const calcDistanceTrend = (run: IRun, avg: number): string => getTrendByDeviation(avg - run.distance);
const calcVdotTrend = (run: IRun, avg: number): string => getTrendByDeviation(avg - run.vdot);

const getTrendByDeviation = (deviation: number): string => {
    let trend = '';

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
