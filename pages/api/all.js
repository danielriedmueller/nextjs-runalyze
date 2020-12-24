const db = require('better-sqlite3')(process.env.DATABASE_URL);

export default async function handle(req, res) {
    const rows = db.prepare('SELECT * FROM runs ORDER BY date desc').all();
    res.json(rows);
}