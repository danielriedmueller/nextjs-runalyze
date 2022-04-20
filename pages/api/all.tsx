import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import {decryptUser} from "../../helper/crypto";
import IDbRun from "../../interfaces/IDbRun";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req, res): Promise<IDbRun[]> {
    await cors(req, res);

    const {user} = req.body;
    
    let runs = db.prepare('SELECT * FROM runs WHERE user = ? ORDER BY startTime desc').all(decryptUser(user));

    return res.json(runs);
}



