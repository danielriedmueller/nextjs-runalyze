export interface IDbRun {
    id: number,
    startTime: number,
    endTime: number,
    distance: number,
    vdot?: number,
    calories?: number,
    steps?: number
}