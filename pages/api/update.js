import prisma from '../../lib/prisma';

export default async function handle(req, res) {
    const {date, distance, duration, id} = req.body;

    const result = await prisma.runs.upsert({
        where: {id},
        update: {date, distance, duration},
        create: {date, distance, duration}
    })

    res.json(result);
}