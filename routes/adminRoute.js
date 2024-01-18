const express = require('express');
const adminRouter = express.Router();

const adminController = require('../controllers/adminController');
const loginValidate = require('../middleware/loginValidate');


// admin login ekranı
adminRouter.post('/login', loginValidate, adminController.postAdminLogin);

// admin çıkış ekranı
adminRouter.post('/exit', adminController.postAdminExit);

// kullanıcıları gösterir
adminRouter.get('/users/:page', adminController.getAllUsers);

// spesifik bir kullanıcının bilgilerini gösterir
adminRouter.get('/user/:userId', adminController.getUserByUserId);

// spesifik bir kullanıcının bilgilerini günceller
adminRouter.put('/user/:userId', adminController.putUserByUserId);

// spesifik bir kullanıcının işlemlerini gösterir
adminRouter.get('/user/:userId/proccess', adminController.getUserProccessByUserId);

// spesifik bir kullanıcının spesifik bir islemini gösterir
adminRouter.get('/user/:userId/proccess/:proccessId', adminController.getUserProccessByProccessId);

// spesifik bir kullanıcının spesifik bir işlemini siler
adminRouter.delete('/user/:userId/proccess/:proccessId', adminController.deleteUserProccessByProccessId);

// spesifik bir kullanıcıyı siler
adminRouter.delete('/user/:userId', adminController.deleteUserByUserId);



module.exports = adminRouter;
