import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'
import {NextApiRequest, NextApiResponse} from "next";

const cors = initMiddleware(
    Cors({
        methods: ['GET'],
    })
)

export default async function handle(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    await cors(req, res);
    console.log("FOOOBAR");
    res.json(true);
}
