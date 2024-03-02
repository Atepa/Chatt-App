const mongoose = require('mongoose');

const friendsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  friendsList: [
    new mongoose.Schema({
      friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      userMail: {
        type: String,
        required: true,
      },
      userNickName: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      avatarImage: {
        type: String,
        default: '',
      },
      timestamp: {
        type: Date,
        default: () => new Date(Date.now() + (3 * 60 * 60 * 1000)),
      },
    }, { _id: false }),
  ],
});

const friendsModel = mongoose.model('friends', friendsSchema);

module.exports = friendsModel;
