import IDbRun from "../../interfaces/IDbRun";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

export const insertRun = async (
    user: string,
    run: IDbRun
): Promise<number> => {
    if (run.id) {
        throw new Error('Tried to insert existing run in DB');
    }

    return db.prepare('INSERT INTO runs(startTime, distance, vdot, user, endTime, calories, steps) VALUES(?, ?, ?, ?, ?, ?, ?)').run(
        run.startTime,
        run.distance,
        run.vdot,
        user,
        run.endTime,
        run.calories,
        run.steps
    ).lastInsertRowid;
}

