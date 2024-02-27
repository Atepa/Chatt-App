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

authRouter.get('/allusers/:id', authController.getAllUsers);

authRouter.post('/setavatar/:id', tokenValidate, authController.setAvatar);

authRouter.get('/friends-list/:userId', authController.getFriendsListByUserId);

authRouter.post('/add-friend/:userId', authController.postAddFriendByUserId);

authRouter.get('/search-user', authController.getSearchUser);

// story
authRouter.get('/story', tokenValidate, authController.getStories);

authRouter.get('/story/:userId', tokenValidate, authController.getStoryByUserId);

authRouter.delete('/story/delete/:userId/:storyId', tokenValidate, authController.deleteStoryByStoryId);

authRouter.post('/add-story/user/:userId', tokenValidate, upload.single('file'), authController.postStoryById);

authRouter.post('/post-access-story/:userId/:storyId', tokenValidate, authController.postStoryByCurrentId);

authRouter.get('/get-access-story/:userId/:storyId', tokenValidate, authController.getAccesStoryById);

// user Info
authRouter.get('/user/info/:userId', tokenValidate, authController.getUserByUserId);

authRouter.put('/user/update/:userId', tokenValidate, authController.putUserByUserId);

authRouter.put('/user/update-password/:userId', tokenValidate, authController.putUserPasswordByUserId);

module.exports = authRouter;
