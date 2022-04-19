import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import {fetchVdot} from "./vdot";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET', 'POST', 'OPTIONS'],
    })
)

export default async function handle(req, res) {
    // Run cors
    await cors(req, res);

    let {date, distance, duration, id} = req.body;
    const vdot = await getVdot(distance, duration);

    if (id === 0) {
        const info = db.prepare('INSERT INTO runs(date, distance, duration, vdot) VALUES(?, ?, ?, ?)').run(
            date,
            distance,
            duration,
            vdot
        );

        id = info.lastInsertRowid;
    } else {
        db.prepare('UPDATE runs SET date = ?, distance = ?, duration = ?, vdot = ? WHERE id = ?').run(
            date,
            distance,
            duration,
            vdot,
            id
        );
    }

    const run = db.prepare('SELECT * FROM runs WHERE id = ?').get(id);

    res.json(run);
}

export const insertRun = async (
    startTime: number,
    endTime: number,
    distance: number,
    calories: number,
    user: number,
    steps: number
): Promise<number> => {
    const vdot = await fetchVdot(distance, startTime, endTime);
    const info = db.prepare('INSERT INTO runs(startTime, distance, vdot, user, endTime, calories, steps) VALUES(?, ?, ?, ?, ?, ?, ?)').run(
        startTime,
        distance,
        vdot,
        user,
        endTime,
        calories,
        steps
    );

    return info.lastInsertRowid;
}
