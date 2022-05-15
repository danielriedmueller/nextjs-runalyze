import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import {decryptUser} from "../../helper/crypto";
import {NextApiRequest, NextApiResponse} from "next";
import IDbRun from "../../interfaces/IDbRun";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req: NextApiRequest, res: NextApiResponse<IDbRun[]>): Promise<void> {
    await cors(req, res);
    const {user} = req.body;
    let runs = db.prepare('SELECT * FROM runs WHERE user = ? ORDER BY startTime desc').all(decryptUser(user));
    res.json(runs);
}



