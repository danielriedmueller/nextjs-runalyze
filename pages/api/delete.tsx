import IDbRun from "../../interfaces/IDbRun";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

export const deleteRun = async (
    user: string,
    startTime: number,
    endTime: number
): Promise<void> => {
    if (!startTime || !endTime) {
        throw new Error('Tried to delete run without start time and end time');
    }

    db.prepare('DELETE FROM runs WHERE startTime = ? AND endTime = ?').run(startTime, endTime);
}

