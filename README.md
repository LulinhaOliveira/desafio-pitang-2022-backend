# desafio-pitang-2022-backend

O desafio do treinamento da Pitang de 2022, consiste em um sistema de agendamento para vacina da Covid-19.

## Modelo

A API utiliza o ORM Prisma para trabalhar o banco em MySQL.
Faz uso do JOI and Express-Joi-Validation Para Tratar a Entrada de Dados.
Utiliza o Express Para Gerenciamento de Rotas.

## Prisma

O prisma contém dois models : Scheduling e User;

Scheduling (Agendamento) Está Estrurado com um campo de nome date_time do tipo Date_Time que atua como PK; Tabela Direcionada a Guardar a Data e Hora dos agendamentos.

User (Usuário ou Paciente) - > Aqueles que vão se vacinar, está estruturado com o campo :
id como PK e UUID;
name como string e requerido;
birth_date como Date_Time e requerido;
status como String (Enum : attended, not_attended ou pending)
schedulingId como FK de Scheduling;

## Rotas (Requisições)

Existem três rotas que podem ser chamadas :
POST (scheduling) => Criar um novo agendamento;
GET (scheduling) => Traz todos os agendamentos;
PATCH (schedulin/id) => Onde o usuario com o id terá seu status atualizado;

### POST

O post faz um verificação para ver se é possivel realizar a criação;
Primeiro faz uma busca de todos agendamento daquele dia para certificar que não ultrapassará 20;
Segundo busca saber se aquele horario já é registrado;
Se for registrado, faz uma verificação da quantidade de pessoas agendadas, se for menor que duas ele faz o registro;
Se não for registrado, faz uma busca verificando intervalo de horas entre os demais horarios, se não tiver nenhum horario a menos de 1 hora ele realiza o registro

Os campos de entradas são :
name
data_time
birth_date

### PATCH

Os campos de entradas são :
status

## Validações (Joi)

### POST

name : Necessita ser uma string obrigatória e não vazia
birth_date : Necessita ser uma date valida pelo ISO e obrigatória
date_time : Através de um validação por regex, o date_time deve seguir esse formato : YYYY-MM-DDThh:mm:ss.000Z

### PATCH

status : Necessita ser uma string obrigatória e um valor valido (pendig, attended, not_attended)
