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

    const {run} = req.body;
    const dbRun = await DbRun.fromEditRun(run);

    await updateRun(dbRun);
}

export const updateRun = async (
    run: IDbRun
): Promise<number> => {
    if (!run.id) {
        throw new Error('Tried to update non-existing run in DB');
    }

    return db.prepare('UPDATE runs SET startTime = ?, distance = ?, vdot = ?, endTime = ?, calories = ?, steps = ? WHERE id = ?').run(
        run.startTime,
        run.distance,
        run.vdot,
        run.endTime,
        run.calories,
        run.steps,
        run.id
    );
};
