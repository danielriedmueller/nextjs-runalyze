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

    const {id} = req.body;
    db.prepare('DELETE FROM runs WHERE id = ?').run(id);
    res.json({});
}
