import prisma from '../../lib/prisma';

export default async function handle(req, res) {
    const {startOfMonth, endOfMonth} = req.body;
    const runs = await prisma.runs.findMany({
        where: {
          date: {
              gte: startOfMonth,
              lte: endOfMonth
          }
        },
        orderBy: {
            date: 'desc'
        }
    });

    res.json(runs);
}