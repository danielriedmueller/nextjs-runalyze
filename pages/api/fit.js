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

    const {token} = req.body;

    /*
    let formData = new FormData();
    formData.append('distance', '5');
    formData.append('unit', 'km');
    formData.append('time', '01:00:00');

     */

    const startTime = '2022-04-11T00:00:00.000Z';
    const joggingActivityType = 56;
    const params = new URLSearchParams({
        activityType: joggingActivityType,
        startTime: startTime,
    });

    const fitData = await fetch('https://fitness.googleapis.com/fitness/v1/users/me/sessions?' + params, {
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`, // notice the Bearer before your token
        },
    });

    const fitRuns = await fitData.json();

    res.json(fitRuns);
}
