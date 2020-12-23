import prisma from '../../lib/prisma';

export default async function handle(req, res) {
    const runs = await prisma.runs.findMany({
        orderBy: {
            date: 'desc'
        }
    });

    res.json(runs);
}