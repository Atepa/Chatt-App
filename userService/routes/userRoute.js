const express = require('express');

const authRouter = express.Router();
const multer = require('multer');

const authController = require('../controllers/userController');
const registerValidate = require('../middleware/registerValidate');
const tokenValidate = require('../middleware/tokenValidate');
const loginValidate = require('../middleware/loginValidate');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    return cb(null, '../userService/public');
  },
  filename(req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

authRouter.post('/register', registerValidate, authController.postCreateUser);

authRouter.post('/login', loginValidate, authController.postLoginUser);

authRouter.get('/logout/:id', authController.getExitUser);

authRouter.put('/reset-password/:userId', tokenValidate, authController.postChangePasswordUser);

authRouter.post('/changemail', tokenValidate, authController.postChangeMailUser);

authRouter.post('/forgot/password', authController.postForgotPassword);

authRouter.post('/refresh/password/:refreshToken/:userId', authController.postRefreshPassword);

authRouter.post('/refresh/has-refresh-password/:refreshToken/:userId', authController.postHasRefreshPassword);

authRouter.get('/story', tokenValidate, authController.getStories);

authRouter.get('/story/:userId', tokenValidate, authController.getStoryByUserId);

authRouter.delete('/story/delete/:storyId', tokenValidate, authController.deleteStoryByStoryId);

authRouter.post('/add-story/user/:userId', tokenValidate, upload.single('file'), authController.postStoryById);

authRouter.get('/user/info/:userId', tokenValidate, authController.getUserByUserId);

authRouter.put('/user/update/:userId', tokenValidate, authController.putUserByUserId);

authRouter.put('/user/update-password/:userId', tokenValidate, authController.putUserPasswordByUserId);

authRouter.get('/allusers/:id', authController.getAllUsers);

authRouter.post('/setavatar/:id', tokenValidate, authController.setAvatar);

module.exports = authRouter;
