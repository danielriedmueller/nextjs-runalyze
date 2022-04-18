// Initialize the cors middleware
import initMiddleware from "../../lib/init-middleware";
import Cors from "cors";
const FormData = require('form-data');

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

    let formData = new FormData();
    formData.append('distance', '5');
    formData.append('unit', 'km');
    formData.append('time', '01:00:00');

    const vdotData = await fetch(process.env.VDOT_API, {
        method: 'POST',
        body: formData
    });
    const vdot = await vdotData.json();

    res.json(vdot);
}

export async function getVdot(distance, duration) {
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
