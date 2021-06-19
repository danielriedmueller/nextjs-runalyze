import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
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

    let {date, distance, duration, id} = req.body;
    const vdot = await getVdot(distance, duration);

    if (id === 0) {
        const info = db.prepare('INSERT INTO runs(date, distance, duration, vdot) VALUES(?, ?, ?, ?)').run(
            date,
            distance,
            duration,
            vdot
        );

        id = info.lastInsertRowid;
    } else {
        db.prepare('UPDATE runs SET date = ?, distance = ?, duration = ?, vdot = ? WHERE id = ?').run(
            date,
            distance,
            duration,
            vdot,
            id
        );
    }

    const run = db.prepare('SELECT * FROM runs WHERE id = ?').get(id);

    res.json(run);
}

async function getVdot(distance, duration) {
    let formData = new FormData();
    formData.append('distance', distance);
    formData.append('unit', 'km');
    formData.append('time', modifyTime(duration));

    const result = await fetch(process.env.VDOT_API, {
        method: 'POST',
        body: formData
    });

    const vdot = await result.json();

    return vdot.vdot;
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
