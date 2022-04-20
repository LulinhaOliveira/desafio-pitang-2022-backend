import Joi from 'joi';
import prisma from '@prisma/client';
const { Status } = prisma;

let arrayStatus = [];

for (let prop in Status) {
    arrayStatus.push(`${prop}`);
}

const querySchemaCreate = Joi.object({
    name: Joi.string().required().messages({
        'any.required': `Name is required`,
        'string.empty': 'The name must not be empty',
    }),
    birth_date: Joi.date().iso().required().messages({
        'date.format': 'Enter a valid date',
        'any.required': `Birth Date is required`,
    }),
    date_time: Joi.string()
        .pattern(
            new RegExp(
                /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]).000Z$/
            )
        )
        .required()
        .messages({
            'string.pattern.base': 'Enter a valid date',
            'string.empty': 'Enter a valid date',
            'any.required': `Date and Time is required`,
        }),
});

const querySchemaUptaded = Joi.object({
    status: Joi.valid(...arrayStatus)
        .required()
        .messages({
            'any.only': 'Enter a valid Status (pending, attended, not_attended',
        }),
});

const errorJSON = (err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({
            Message: err.error.toString().split(': ')[1],
        });
    } else {
        next(err);
    }
};

export { querySchemaCreate, querySchemaUptaded, errorJSON };
