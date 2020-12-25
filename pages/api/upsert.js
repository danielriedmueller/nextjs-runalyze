import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";

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

    if (id === 0) {
        const info = db.prepare('INSERT INTO runs(date, distance, duration) VALUES(?, ?, ?)').run(
            date,
            distance,
            duration
        );

        id = info.lastInsertRowid
    } else {
        db.prepare('UPDATE runs SET date = ?, distance = ?, duration = ? WHERE id = ?').run(
            date,
            distance,
            duration,
            id
        );
    }

    const run = db.prepare('SELECT * FROM runs WHERE id = ?').get(id);

    res.json(run);
}