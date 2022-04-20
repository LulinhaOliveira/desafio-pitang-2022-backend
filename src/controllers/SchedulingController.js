<<<<<<< HEAD
import prisma from '@prisma/client';
const prismaClient = new prisma.PrismaClient();
=======
import PrismaClient from '../database/index.js';
const prismaClient = new PrismaClient();
>>>>>>> efb8ad60a259df2554dc68cf8711399429aec775

class SchedulingController {
    async store(request, response) {
        const { date_time, name, birth_date } = request.body;

        //Manipulando o datetime para utilizar na consulta ao banco, a fim de retornar apenas os agendamentos do dia;
        const date_start_day = new Date(date_time.split('T')[0]); // date_start_day => recebe a data com a hora zerada
        const date_end_day = new Date(date_start_day.valueOf());
        date_end_day.setDate(date_end_day.getDate() + 1); // date_end_day => altera seu time para o final do dia

        try {
            const schedulings = await prismaClient.scheduling.findMany({
                where: {
                    date_time: {
                        gte: date_start_day,
                        lt: date_end_day,
                    },
                },
                include: {
                    users: true,
                },
            });

            const qtdSchedulings = schedulings.reduce((total, element) => {
                return total + element.users.length;
            }, 0);

            if (qtdSchedulings < 20) {
                //Verifica se a data e hora do agendamento já existe
                const scheduling = schedulings.find((value) => {
                    return (
                        value.date_time.valueOf() ===
                        new Date(date_time).valueOf()
                    );
                });

                if (scheduling === undefined) {
                    //Verifica a existência de outro agendamento a menos de uma hora de diferença
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
                            Message: 'Appointments must be one hour apart',
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

                        return response.status(201).send({
                            created: true,
                            scheduling_number: 1,
                            result,
                        });
                    }
                } else {
                    // Verifica se o agendamento já possue duas pessoas para a data e hora
                    if (scheduling.users.length < 2) {
                        const result = await prismaClient.user.create({
                            data: {
                                name,
                                birth_date,
                                schedulingId: date_time,
                            },
                        });

                        return response.status(201).send({
                            created: true,
                            scheduling_number: 2,
                            result,
                        });
                    } else {
                        return response.status(400).send({
                            Error: true,
                            Message:
                                'There can only be 2 appointments per hour',
                        });
                    }
                }
            } else {
                return response.status(400).send({
                    Error: true,
                    Message: 'There can only be 20 appointments per day',
                });
            }
        } catch (error) {
            response.status(500).send({ Error: 'Failed to Create Data' });
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
<<<<<<< HEAD
            return response.status(500).send({ Error: 'Failed to Fetch Data' });
=======
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
>>>>>>> efb8ad60a259df2554dc68cf8711399429aec775
        }
    }
}

export default SchedulingController;
