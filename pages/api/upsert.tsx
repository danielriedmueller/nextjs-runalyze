import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
import {encryptUser} from "../../helper/crypto";
import {IDbRun} from "../../interfaces/IDbRun";
import {DbRun} from "../../model/DbRun";

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

    if (dbRun.isNew()) {
        await insertRun(user, dbRun);
    } else {
        await updateRun(dbRun);
    }

    res.json({});
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
        encryptUser(user),
        run.endTime,
        run.calories,
        run.steps
    ).lastInsertRowid;
}

