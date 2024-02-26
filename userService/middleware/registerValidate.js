const userRegisterValidate = require('../validation/userRegisterValidate');

function validateRegisterUser(req, res, next) {
  const { error } = userRegisterValidate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  return next();
}

module.exports = validateRegisterUser;
