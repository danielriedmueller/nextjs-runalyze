import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import DbRun from "../../model/DbRun";
import IDbRun from "../../interfaces/IDbRun";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['POST'],
    })
)

export default async function handle(req, res) {
    await cors(req, res);

    const {run, user} = req.body;
    const dbRun = await DbRun.fromEditRun(run);

    // TODO: Check achievements

    await insertRun(user, dbRun);

    res.json({});
}

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

