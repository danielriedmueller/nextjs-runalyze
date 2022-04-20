import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";

const db = require('better-sqlite3')(process.env.DATABASE_URL);

const cors = initMiddleware(
    Cors({
        methods: ['POST'],
    })
)

export default async function handle(req, res) {
    await cors(req, res);

    const {id} = req.body;

    db.prepare('DELETE FROM runs WHERE id = ?').run(id);

    res.json({});
}
