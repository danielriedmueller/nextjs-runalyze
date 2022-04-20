import {Duration} from "dayjs/plugin/duration";

export default interface IRun {
    date: string;
    distance: number;
    vdot: number;
    duration: Duration;
    id: number;
    calories?: number;
    steps?: number;
    getDateDay: () => string;
    getPace: () => string;
    getDuration: () => string;
}
