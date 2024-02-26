const Joi = require('joi');

function userValidate(UserRegister) {
  const userLocation = new Joi.object({
    locationCountry: Joi.string().default('Türkiye'),
    locationPostCode: Joi.number().default(''),
    locationAddress: Joi.string().default('Ankara'),
  });

  const userRegisterSchema = new Joi.object(
    {
      userActive: Joi.boolean().default('true'),
      userIsAdmin: Joi.boolean().default('false'),
      userMail: Joi.string().pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
      userPassword: Joi.string().min(8).required(),
      userName: Joi.string().min(5).required(),
      userNickName: Joi.string().min(3).required(),
      userColor: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).required(),
      userGender: Joi.string().required(),
      userCreatedAt: Joi.date(),
      userDeActivateTime: Joi.date().default('null'),
      userLocation,
      userLastAccessTime: Joi.date(),
      userProfilePhotoUrl: Joi.string(),
    },
  );
  return userRegisterSchema.validate(UserRegister, { abortEarly: false });
}

module.exports = userValidate;
