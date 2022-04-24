import { execSync } from 'child_process';
import { Sequelize } from 'sequelize';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../../src/config/index.js';

chai.use(chaiHttp);
chai.should();

before((done) => {
    execSync(`npx prisma migrate dev`);
    done();
});

after(async () => {
    try {
        const sequelize = new Sequelize(process.env.DATABASE_URL);
        const db_name = process.env.DATABASE_URL.split('/');
        await sequelize.query(`DROP DATABASE ${db_name[db_name.length - 1]}`);
        sequelize.close();
    } catch (error) {
        console.log(error);
    }
});

const scheduling = [
    {
        date_time: '2019-01-01T12:00:00.000Z',
        name: 'UserTest1',
        birth_date: '1999-01-01T12:00:00.000Z',
    },
    {
        date_time: '2019-01-01T12:40:00.000Z',
        name: 'UserTest2',
        birth_date: '1999-01-01T12:00:00.000Z',
    },
    {
        date_time: '2019-01-02T12:00:00.000Z',
        name: 'UserTest3',
        birth_date: '1999-01-01T12:00:00.000Z',
    },
    {
        date_time: '2019-01-03T12:00:00.000Z',
        name: 'UserTest4',
        birth_date: '1999-01-01T12:00:00.000Z',
    },
];

describe('Test Router Post', () => {
    it('Primerio Agendamento Naquele Dia e Hora', async () => {
        const resultExpect = {
            created: true,
            scheduling_number: 1,
        };
        await chai
            .request(app)
            .post('/scheduling')
            .send(scheduling[0])
            .then((response) => {
                chai.expect(response.status).to.eql(201);
                chai.expect(response.body.created).to.eql(resultExpect.created);
                chai.expect(response.body.scheduling_number).to.eql(
                    resultExpect.scheduling_number
                );
                chai.expect(response.body).to.haveOwnProperty('result');
            });
    });

    it('Segundo Agendamento Naquele Dia e Hora', async () => {
        const resultExpect = {
            created: true,
            scheduling_number: 2,
        };
        await chai
            .request(app)
            .post('/scheduling')
            .send(scheduling[0])
            .then((response) => {
                chai.expect(response.status).to.eql(201);
                chai.expect(response.body.created).to.eql(resultExpect.created);
                chai.expect(response.body.scheduling_number).to.eql(
                    resultExpect.scheduling_number
                );
                chai.expect(response.body).to.haveOwnProperty('result');
            });
    });

    it('Falha ao Tentar Terceiro Agendamento no Mesmo Dia e Hora', async () => {
        const resultExpect = {
            Error: true,
            Message: 'Só Pode Haver 2 Agendamentos Por Hora',
        };
        await chai
            .request(app)
            .post('/scheduling')
            .send(scheduling[0]) // vamos enviar esse arquivo
            .then((response) => {
                chai.expect(response.status).to.eql(400);
                chai.expect(response.body.Error).to.eql(resultExpect.Error);
                chai.expect(response.body).to.haveOwnProperty('Message');
            });
    });

    it('Falha ao Tentar Agendamento Em Menos de Uma Hora', async () => {
        const resultExpect = {
            Error: true,
        };
        await chai
            .request(app)
            .post('/scheduling')
            .send(scheduling[1])
            .then((response) => {
                chai.expect(response.status).to.eql(400);
                chai.expect(response.body.Error).to.eql(resultExpect.Error);
                chai.expect(response.body).to.haveOwnProperty('Message');
            });
    });

    it('Agendamento em Outro Dia', async () => {
        const resultExpect = {
            created: true,
            scheduling_number: 1,
        };
        await chai
            .request(app)
            .post('/scheduling')
            .send(scheduling[2])
            .then((response) => {
                chai.expect(response.status).to.eql(201);
                chai.expect(response.body.created).to.eql(resultExpect.created);
                chai.expect(response.body.scheduling_number).to.eql(
                    resultExpect.scheduling_number
                );
                chai.expect(response.body).to.haveOwnProperty('result');
            });
    });

    it('Falha ao Tentar Mais de 20 Agendamento Por Dia', async () => {
        const resultExpect = {
            Error: true,
        };
        let response;
        let hr = 13;
        for (let i = 0; i < 19; i++) {
            let aux = scheduling[0].date_time.split('T');
            aux = `${aux[0]}T${hr}:00:00.000Z`;
            scheduling[0].date_time = aux;
            if (i % 2 === 1) {
                hr = hr + 1;
            }

            response = await chai
                .request(app)
                .post('/scheduling')
                .send(scheduling[0])
                .then((res) => {
                    return res;
                });
        }
        chai.expect(response.status).to.eql(400);
        chai.expect(response.body.Error).to.eql(resultExpect.Error);
        chai.expect(response.body).to.haveOwnProperty('Message');
    });

    it('Created  Scheduling Validaded date_time ERROR', async () => {
        const dataInvalid = {
            name: 'UserTest2',
            birth_date: '1999-01-01T12:00:00.000Z',
        };

        await chai
            .request(app)
            .post('/scheduling')
            .send(dataInvalid)
            .then((response) => {
                chai.expect(response.status).to.eql(400);
                chai.expect(response.body).to.haveOwnProperty('Message');
            });
    });

    it('Created  Scheduling Validaded name ERROR', async () => {
        const dataInvalid = {
            date_time: '2019-01-01T12:00:00.000Z',
            birth_date: '1999-01-01T12:00:00.000Z',
        };

        await chai
            .request(app)
            .post('/scheduling')
            .send(dataInvalid)
            .then((response) => {
                chai.expect(response.status).to.eql(400);
                chai.expect(response.body).to.haveOwnProperty('Message');
            });
    });

    it('Created  Scheduling Validaded birht_date ERROR', async () => {
        const dataInvalid = {
            date_time: '2019-01-01T17:00:00.000Z',
            name: 'UserTest5',
        };

        await chai
            .request(app)
            .post('/scheduling')
            .send(dataInvalid)
            .then((response) => {
                chai.expect(response.status).to.eql(400);
                chai.expect(response.body).to.haveOwnProperty('Message');
            });
    });
});

describe('Test Router GET', () => {
    it('Get All Sheduling', async () => {
        await chai
            .request(app)
            .get('/scheduling')
            .then((response) => {
                const qtdScheduling = response.body.reduce((total, element) => {
                    return total + element.users.length;
                }, 0);

                chai.expect(qtdScheduling).to.eql(21);
                chai.expect(response.status).to.eql(200);
            });
    });
});

describe('Teste Router PATCH', () => {
    it('Uptaded Status', async () => {
        await chai
            .request(app)
            .post('/scheduling')
            .send(scheduling[3])
            .then(async (response) => {
                await chai
                    .request(app)
                    .patch(`/scheduling/${response.body.result.id}`)
                    .send({ status: 'attended' })
                    .then((response) => {
                        chai.expect(response.status).to.eql(200);
                        chai.expect(response.body.uptaded).to.eql(true);
                        chai.expect(response.body.status).to.eql('attended');
                    });
            });
    });

    it('Uptaded Status Validaded Data ERROR', async () => {
        await chai
            .request(app)
            .post('/scheduling')
            .send(scheduling[3])
            .then(async (response) => {
                await chai
                    .request(app)
                    .patch(`/scheduling/${response.body.result.id}`)
                    .send({ status: 'attended_error' })
                    .then((response) => {
                        chai.expect(response.status).to.eql(400);
                        chai.expect(response.body).to.haveOwnProperty(
                            'Message'
                        );
                    });
            });
    });
});
