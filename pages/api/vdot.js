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

    const vdot = await fetch(process.env.VDOT_API, {
        method: 'POST',
        body: formData
    });

    const yearRuns = await vdot.json();

    console.log(yearRuns.vdot);

    res.json(yearRuns);
}
