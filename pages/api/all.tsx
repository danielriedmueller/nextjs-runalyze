import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import {IRun} from "../../interfaces/IRun";
import {Run} from "../../model/Run";
import {IDbRun} from "../../interfaces/IDbRun";
import {decryptUser} from "../../helper/crypto";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req, res): Promise<IRun[]> {
    await cors(req, res);

    const {user} = req.body;
    
    let runs = db.prepare('SELECT * FROM runs WHERE user = ? ORDER BY startTime desc').all(decryptUser(user));

    return res.json(runs.map((dbRun: IDbRun) => Run.fromDbRun(dbRun)));
}



