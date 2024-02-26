const Joi = require('joi');

function userValidate(UserLogin) {
  const userLoginSchema = new Joi.object(
    {
      userMail: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
      userPassword: Joi.string().min(8).required(),
    },
  );
  return userLoginSchema.validate(UserLogin, { abortEarly: false });
}

module.exports = userValidate;
