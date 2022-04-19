import PrismaClient from '../database/index.js';
const prismaClient = new PrismaClient();

class SchedulingController {
    async store(request, response) {
        const { date_time, name, birth_date } = request.body;
        const date_aux = new Date(date_time.split('T')[0]);
        const date_aux2 = new Date(date_aux.valueOf());
        
        date_aux2.setDate(date_aux2.getDate() + 1);
        date_aux2.toDateString;

        try {
            const schedulings = await prismaClient.scheduling.findMany({
                where: {
                    date_time: {
                        gte: date_aux,
                        lt: date_aux2,
                    },
                },
                include: {
                    users: true,
                },
            });

            const qtdScheduling = schedulings.reduce((total, element) => {
                return total + element.users.length;
            }, 0);

            if (qtdScheduling < 20) {
                const scheduling = schedulings.find((value) => {
                    return (
                        value.date_time.valueOf() ===
                        new Date(date_time).valueOf()
                    );
                });

                if (scheduling === undefined) {
                    const result = schedulings.find((value) => {
                        const difTimeHrs =
                            ((value.date_time - new Date(date_time)) %
                                86400000) /
                            3600000;
                        return difTimeHrs > -1 && difTimeHrs < 1;
                    });

                    if (result !== undefined) {
                        return response.status(400).send({
                            Error: true,
                            Message:
                                'Agendamentos devem ter uma hora de diferença',
                        });
                    } else {
                        await prismaClient.scheduling.create({
                            data: {
                                date_time,
                            },
                        });

                        const result = await prismaClient.user.create({
                            data: {
                                name,
                                birth_date,
                                schedulingId: date_time,
                            },
                        });

                        return response
                            .status(201)
                            .send({ criado: true, agendamento: 1, result });
                    }
                } else {
                    if (scheduling.users.length < 2) {
                        await prismaClient.user.create({
                            data: {
                                name,
                                birth_date,
                                schedulingId: date_time,
                            },
                        });

                        return response
                            .status(201)
                            .send({ criado: true, agendamento: 2 });
                    } else {
                        return response.status(400).send({
                            Error: true,
                            Message: 'Só Pode Haver 2 Agendamentos Por Hora',
                        });
                    }
                }
            } else {
                return response.status(400).send({
                    Error: true,
                    Message: 'Só Pode Haver 20 Agendamentos Por Dia',
                });
            }
        } catch (error) {
            response.status(500).send({ Error: 'Falha ao Criar Dados' });
        }
    }

    async getAll(request, response) {
        try {
            const allScheduling = await prismaClient.scheduling.findMany({
                include: {
                    users: true,
                },
            });

            response.status(200).send(allScheduling);
        } catch (error) {
            console.log(error);
            return response
                .status(500)
                .send({ Error: 'Falha ao Buscr Dados', Message: error });
        }
    }

    async uptadedStatus(request, response) {
        const { status } = request.body;
        const { id } = request.params;

        try {
            await prismaClient.user.update({
                where: {
                    id,
                },
                data: {
                    status,
                },
            });

            return response.status(200).send({ atualizado: true });
        } catch (error) {
            return response
                .status(500)
                .send({ Error: 'Falha ao Atualizar Dado', Message: error });
        }
    }
}

export default SchedulingController;
