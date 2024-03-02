const proccessCalculate = require('../validation/proccessCalculateValidate');


function validateProccessCalculate(req, res, next) {
  const { error } = proccessCalculate(req.body);
  if (error) {
    return res.status(400).send(error.message);
  }

  return next();
};

module.exports = validateProccessCalculate;