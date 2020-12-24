const db = require('better-sqlite3')(process.env.DATABASE_URL);

export default async function handle(req, res) {
    const {start, end} = req.body;

    const rows = db.prepare('SELECT * FROM runs WHERE date >= ? AND date <= ? ORDER BY date desc').all(
        start,
        end
    );

    res.json(rows);
}
