const express = require('express');
const authRouter = express.Router();
const multer = require('multer');

const authController = require('../controllers/authController');
const registerValidate = require('../middleware/registerValidate');
const tokenValidate = require('../middleware/tokenValidate');
const loginValidate = require('../middleware/loginValidate');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./public");
    },
    filename: function (req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

// kullanıcı kayıt eder
authRouter.post('/register', registerValidate, authController.postCreateUser);

// kullanıcı giriş yaptırır
authRouter.post('/login', loginValidate, authController.postLoginUser);

// kullanıcı çıkış yaptırır
authRouter.get('/logout/:id', authController.getExitUser);

// kullanıcı şifre sıfırlar
authRouter.post('/changepassword', tokenValidate, authController.postChangePasswordUser);

// kullanıcı mail sıfırlar
authRouter.post('/changemail', tokenValidate, authController.postChangeMailUser);
//
authRouter.get('/story', authController.getStories);

authRouter.get('/story/:userId', authController.getStoryByUserId);

authRouter.post('/add-story/user/:userId', upload.single('file'), authController.postStoryById);
// spesifik kullanıcıyı getirir
authRouter.get('/user/info/:userId', authController.getUserByUserId);

authRouter.put('/user/update/:userId', authController.putUserByUserId);

authRouter.get("/allusers/:id", tokenValidate, authController.getAllUsers);

authRouter.post("/setavatar/:id", tokenValidate, authController.setAvatar);

module.exports = authRouter;

