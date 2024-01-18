const express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

// main sayfasını gösterir
router.get('/', mainController.mainController);

module.exports = router;