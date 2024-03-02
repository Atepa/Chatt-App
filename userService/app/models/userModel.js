const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userLocationSchema = require('./userLocation');

const usersSchema = mongoose.Schema({
  userIsActive: { type: Boolean, default: true },
  userIsAdmin: { type: Boolean, default: false },
  userMail: { type: String, unique: true },
  userPassword: String,
  userName: String,
  userNickName: { type: String, unique: true },
  userColor: String,
  userGender: String,
  userCreatedAt: { type: Date, default: () => new Date(Date.now() + (3 * 60 * 60 * 1000)) },
  userDeActivateTime: { type: Date, default: null },
  userLocation: userLocationSchema,
  userLastAccessTime: { type: Date, default: () => new Date(Date.now() + (3 * 60 * 60 * 1000)) },
  userProfilePhotoUrl: { type: String, default: 'default.png' },
  isAvatarImageSet: { type: Boolean, default: false },
  avatarImage: { type: String, default: '' },
  hasStory: { type: Boolean, default: false },
  hasRefreshPassword: { type: Boolean, default: false },
  refreshPasswordToken: { type: String, default: '' },
});

usersSchema.methods.createAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      isAdmin: this.userIsAdmin,
    },
    'privateappkey',
    { expiresIn: '1h' },
  );
};

const usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;
