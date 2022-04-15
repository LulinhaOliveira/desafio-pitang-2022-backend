import dayjs from 'dayjs';
import prisma from '@prisma/client';
const prismaClient = new prisma.PrismaClient();

class SchedulingController {
    async store(request, response) {}

    async getAll(request, response) {
        try {
            const allScheduling = await prismaClient.scheduling.findMany({
                include: {
                    users: true,
                },
            });

            response.status(200).send(allScheduling);
        } catch (error) {
            return response.status(500).send({ Error: 'Falha ao Buscr Dados' });
        }
    }
}

export default SchedulingController;
