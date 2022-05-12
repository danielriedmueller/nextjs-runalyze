import IGoogleSession from "./IGoogleSession";

export default interface IUser {
    token: string;
    id: string;
    name: string;
    unfetchedRuns: IGoogleSession[];
}
