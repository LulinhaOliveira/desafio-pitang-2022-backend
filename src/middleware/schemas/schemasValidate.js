import Joi from "joi";

const querySchemaCreate = Joi.object({
    name : Joi.string().required().messages({
        'any.required': `Tenha Certeza de Está Colocando um Nome`,
        'string.empty' : 'O nome não deve ser vazio'
    }),
    birth_date : Joi.date().iso().required().messages({
        "date.format" : "Verifique o Formato da Data"
    }),
    date_time : Joi.string().pattern(new RegExp(/^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])T(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]).000Z$/)).messages({
        "string.pattern.base" : "Verifique o Formato da Data",
    }),

})

const querySchemaUptaded = Joi.object({
    status : Joi.valid("attended","not_attended","pending").required().messages({
        'any.only' : "Tenha Certeza de Está Colocando um Status Valido"
    }),
    
})

const errorJSON = (err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({
            message: err.error.toString()
        }
    );
    }else {
      next(err);
     }
};

export {querySchemaCreate , querySchemaUptaded , errorJSON }