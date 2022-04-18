/**
 * @jest-environment ./prisma/prisma-environment-jest.cjs
 */


const request = require("supertest")
const {app} = require("../../src/config/index.js")


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
    ];

describe("Test Router Post", ()=>{
    it("Primerio Agendamento Naquele Dia e Hora",  async ()=>{
        const resultExpect = {
            criado : true,
            agendamento : 1
        }
        const response = await request(app).post('/scheduling').send(scheduling[0]);
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual(resultExpect);
    
    });

    it("Segundo Agendamento Naquele Dia e Hora", async ()=>{
        const resultExpect = {
            criado : true,
            agendamento : 2
        }
        const response = await request(app).post('/scheduling').send(scheduling[0]);
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual(resultExpect);
    })

    it("Falha ao Tentar Agendamento no Mesmo Dia e Hora", async ()=>{
        const resultExpect = {
            Error : true,
            Message : 'Só Pode Haver 2 Agendamentos Por Hora',
        }
        const response = await request(app).post('/scheduling').send(scheduling[0]);
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual(resultExpect);
    })
    
    it("Falha ao Tentar Agendamento Em Menos de Uma Hora", async()=>{
        const resultExpect = {
            Error : true,
            Message : 'Agendamentos devem ter uma hora de diferença',
        }
        const response = await request(app).post('/scheduling').send(scheduling[1]);
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual(resultExpect);
    })

    it("Falha ao Tentar Mais de 20 Agendamento Por Dia", async ()=>{
        const resultExpect = {
            Error : true,
            Message : 'Só Pode Haver 20 Agendamentos Por Dia',
        }
        let response;
        let hr = 13;
        for(let i = 0; i < 19 ; i++){
            let aux = scheduling[0].date_time.split("T");
            aux = `${aux[0]}T${hr}:00:00.000Z`;
            scheduling[0].date_time = aux;
            console.log(scheduling[0].date_time);
            if(i%2 === 1){
                hr = hr + 1;
            }
          
            response = await request(app).post('/scheduling').send(scheduling[0]);
        }  
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual(resultExpect);

    });

    it("Agendamento em Outro Dia", async()=>{
        const resultExpect = {
            criado : true,
            agendamento : 1,
        }
        const response = await request(app).post('/scheduling').send(scheduling[2]);
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual(resultExpect);
    })

    
})

describe('Test Router Get ', () => { 
    it("Buscando Todos Agendamentos", async () =>{

        const response = await request(app).get('/scheduling');

        expect(response.body.lenght).toBe(21);

    })

 })
