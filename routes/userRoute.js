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

authRouter.post('/register', registerValidate, authController.postCreateUser);

authRouter.post('/login', loginValidate, authController.postLoginUser);

authRouter.get('/logout/:id', authController.getExitUser);

authRouter.put('/reset-password/:userId', tokenValidate, authController.postChangePasswordUser);

authRouter.post('/changemail', tokenValidate, authController.postChangeMailUser);

authRouter.post('/forgot/password', authController.postForgotPassword);

authRouter.get('/story', authController.getStories);

authRouter.get('/story/:userId', authController.getStoryByUserId);

authRouter.delete('/story/delete/:storyId', authController.deleteStoryByStoryId);

authRouter.post('/add-story/user/:userId', upload.single('file'), authController.postStoryById);

authRouter.get('/user/info/:userId', authController.getUserByUserId);

authRouter.put('/user/update/:userId', authController.putUserByUserId);

authRouter.put('/user/update-password/:userId', authController.putUserPasswordByUserId);

authRouter.get("/allusers/:id", tokenValidate, authController.getAllUsers);

authRouter.post("/setavatar/:id", tokenValidate, authController.setAvatar);

module.exports = authRouter;
