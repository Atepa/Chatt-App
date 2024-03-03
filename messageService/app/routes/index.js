const express = require('express');
const path = require('path');

const router = express.Router();
const fs = require('fs');

const routes = fs.readdirSync(`${__dirname}`);

for (const route of routes) {
  if (route.endsWith('.js') && route !== 'index.js') {
    // dynamic route build
    // router.use('/' + route.replace('.js', ''), require(`./${route}`));
    router.use('/messages', require(`./${route}`));
  }
}

module.exports = router;
