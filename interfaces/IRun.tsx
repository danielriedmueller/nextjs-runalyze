import {Duration} from "dayjs/plugin/duration";
import {Dayjs} from "dayjs";

export default interface IRun {
    date: Dayjs;
    distance: number;
    vdot: number;
    duration: Duration;
    id: number;
    calories: number;
    steps: number;
    best: string[];
    isCurrent: boolean;
    getDate: () => string;
    getDatetime: () => string;
    getDateDay: () => string;
    getPace: () => string;
    getDuration: () => string;
    renderDistance: () => string;
    renderCalories: () => string;
    isBestInSomething: () => boolean;

    // Trends
    paceTrend: string;
    distanceTrend: string;
    vdotTrend: string;
    durationTrend: string;
}
