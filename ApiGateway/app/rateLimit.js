const rateLimit = require('express-rate-limit');

const apiLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 150,
  message: 'You have exceeded your 150 requests per each 1 minute limit.',
  headers: true,
});
module.exports = apiLimit;
