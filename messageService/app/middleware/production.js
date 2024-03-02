const helmet = require('helmet');
const compresion = require('compression');

module.exports = function production(app) {
  app.use(helmet());
  app.use(compresion());
};
