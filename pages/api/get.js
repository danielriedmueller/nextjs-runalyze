import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
const db = require('better-sqlite3')(process.env.DATABASE_URL);

// Initialize the cors middleware
const cors = initMiddleware(
    // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
    Cors({
        // Only allow requests with GET, POST and OPTIONS
        methods: ['GET'],
    })
)

export default async function handle(req, res) {
    // Run cors
    await cors(req, res);

    const result = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataSources', {
        method: 'GET',
    });
    console.log(result);

}