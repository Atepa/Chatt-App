const express = require('express');
const authRouter = express.Router();

const authController = require('../controllers/authController');
const registerValidate = require('../middleware/registerValidate');
const tokenValidate = require('../middleware/tokenValidate');
const loginValidate = require('../middleware/loginValidate');

// kullanıcı kayıt eder
authRouter.post('/register', registerValidate, authController.postCreateUser);

// kullanıcı giriş yaptırır
authRouter.post('/login', loginValidate, authController.postLoginUser);

// kullanıcı çıkış yaptırır
authRouter.get('/logout/:id', tokenValidate, authController.getExitUser);

// kullanıcı şifre sıfırlar
authRouter.post('/changepassword', tokenValidate, authController.postChangePasswordUser);

// kullanıcı mail sıfırlar
authRouter.post('/changemail', tokenValidate, authController.postChangeMailUser);

authRouter.get("/allusers/:id", tokenValidate, authController.getAllUsers);

authRouter.post("/setavatar/:id", tokenValidate, authController.setAvatar);

module.exports = authRouter;

