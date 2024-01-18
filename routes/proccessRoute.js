const express = require('express');
const proccessRouter = express.Router();

const proccessController= require('../controllers/proccessController');
const tokenAuth = require('../middleware/tokenValidate');
const proccessDatasValidate = require('../middleware/calculateValidate');

// kullanıcı bilgileri gösterecek
proccessRouter.get('/user/:userId', tokenAuth, proccessController.getUserById);

// kullanıcı bilgileri değiştirecek
proccessRouter.put('/user/:userId', tokenAuth, proccessController.putChangeUserData);   // validasyonunu yap

// kullanıcı yaptığı işlemleri görecek
proccessRouter.get('/userproccess/user/:userId', tokenAuth, proccessController.getProccessByUserId);

// kullanıcı yaptığı spesifik bir işlemi görecek
proccessRouter.get('/userproccess/user/:userId/proccess/:proccessId', tokenAuth, proccessController.getProccessById);

// verileri alıp işleme gönderecek
proccessRouter.post('/calculate', tokenAuth, proccessDatasValidate, proccessController.postCalculateUser);

// en fazla işlem yapan kullanıcıları gösterir
proccessRouter.get('/bestusers', tokenAuth, proccessController.getBestUsers);

module.exports = proccessRouter;
