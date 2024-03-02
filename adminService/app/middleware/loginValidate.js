const userLoginValidate = require('../validation/userLoginValidate');

function validateLoginUser(req, res, next) {
  const { error } = userLoginValidate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }
  return next();
}

module.exports = validateLoginUser;
