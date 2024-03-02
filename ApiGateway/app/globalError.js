module.exports = function functionGlobalError(err, req, res, next) {
  res.status(500).send({ msg: `Server Error: ${err.message}`, status: false });
  next();
};
