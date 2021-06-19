import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
const FormData = require('form-data');

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

    let runs = db.prepare('SELECT * FROM runs ORDER BY date desc').all();

    //syncVdot(runs);

    res.json(runs);
}

async function syncVdot(runs) {
    runs.forEach(async (run) => {
        let formData = new FormData();
        formData.append('distance', run.distance);
        formData.append('unit', 'km');
        formData.append('time', modifyTime(run.duration));

        const result = await fetch(process.env.VDOT_API, {
            method: 'POST',
            body: formData
        });

        const vdot = await result.json();

        db.prepare('UPDATE runs SET vdot = ? WHERE id = ?').run(vdot.vdot, run.id);
    })
}

function modifyTime(time) {
    let splitted = time.split(':').map((part) => {
        if (part.length === 1) {
            return "0" + part;
        }

        return part;
    });

    if (splitted.length === 3) {
        return splitted.join(":");
    }

    if (splitted.length === 2) {
        splitted.unshift("00");
    }

    if (splitted.length === 1) {
        splitted.unshift("00");
        splitted.unshift("00");
    }

    return splitted.join(":");
}
