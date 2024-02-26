const mongoose = require('mongoose');

const StoryScheman = mongoose.Schema({
  senderUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  senderUserAvatarImage: {
    type: String,
    default: 'default.png',
    required: true,
  },
  senderUserNickName: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  storyPath: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  accessUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      userNickName: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: () => new Date(Date.now() + (3 * 60 * 60 * 1000)),
      },
    },
  ],
}, {
  timestamps: {
    currentTime: () => new Date(Date.now() + (3 * 60 * 60 * 1000)),
  },
});

module.exports = mongoose.model('Stories', StoryScheman);
