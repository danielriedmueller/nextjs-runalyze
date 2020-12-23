import prisma from '../../lib/prisma';

export default async function handle(req, res) {
    const {startOfYear, endOfYear} = req.body;
    const runs = await prisma.runs.findMany({
        where: {
          date: {
              gte: startOfYear,
              lte: endOfYear
          }
        },
        orderBy: {
            date: 'desc'
        }
    });

    res.json(runs);
}