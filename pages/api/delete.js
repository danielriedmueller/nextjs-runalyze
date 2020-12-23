import prisma from '../../lib/prisma';

export default async function handle(req, res) {
    const result = await prisma.runs.delete({
        where: {
            id: req.body
        }
    });

    res.json(result);
}