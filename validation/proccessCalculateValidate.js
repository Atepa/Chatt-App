const Joi = require('joi');

function calculateValidate(calculateData){

    const calculateSchema = new Joi.object(
      {
        data1: Joi.number().required(),
        data2: Joi.number().required(),
        proccessString: Joi.string().required(),
      },
    );
    return calculateSchema.validate(calculateData, { abortEarly: false });
};
    
module.exports = calculateValidate;