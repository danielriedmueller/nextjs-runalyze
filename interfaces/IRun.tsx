import {Duration} from "dayjs/plugin/duration";
import {Dayjs} from "dayjs";

export default interface IRun {
    date: Dayjs;
    distance: number;
    vdot: number;
    duration: Duration;
    id: number;
    calories?: number;
    steps?: number;
    best: string[];
    getDate: () => string;
    getDateDay: () => string;
    getPace: () => string;
    getDuration: () => string;
}
