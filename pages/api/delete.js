const db = require('better-sqlite3')(process.env.DATABASE_URL);

export default async function handle(req, res) {
    const {id} = req.body;
    db.prepare('DELETE FROM runs WHERE id = ?').run(id);
    res.json({});
}
