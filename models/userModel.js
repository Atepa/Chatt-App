const mongoose = require('mongoose');
const userLocationSchema = require('./userLocation');
const jwt = require('jsonwebtoken');


const istanbulTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
const istanbulDate = new Date(istanbulTime);
istanbulDate.setHours(istanbulDate.getHours() + 3);

const usersSchema = mongoose.Schema({
    userIsActive: {type: Boolean, default: true},
    userIsAdmin: {type: Boolean, default: false},
    userMail: {type: String, unique: true},
    userPassword: String,
    userName: String,
    userNickName: {type: String, unique: true},
    userColor: String,
    userGender: String,
    userCreatedAt: {type: Date, default: istanbulDate},
    userDeActivateTime: {type: Date, default: null},
    userLocation: userLocationSchema,
    userLastAccessTime: { type: Date, default: istanbulDate},
    userProfilePhotoUrl: { type: String, default: 'default.png'}, 
    isAvatarImageSet: { type: Boolean, default: false },
    avatarImage: { type: String, default: '' },
});
usersSchema.methods.createAuthToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            isAdmin: this.userIsAdmin,
        }, 
        'privateappkey',
        { expiresIn: '1h' }
    );
}

const usersModel = mongoose.model('Users', usersSchema);

module.exports = usersModel;