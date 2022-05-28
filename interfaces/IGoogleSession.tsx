export enum SyncType {
    Insert = 1,
    Delete = 2
}

export default interface IGoogleSession {
    startTimeMillis: number;
    endTimeMillis: number;
    syncType: SyncType
}
