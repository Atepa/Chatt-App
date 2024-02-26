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
  isActive: { type: Boolean, default: true },
}, {
  timestamps: {
    currentTime: () => new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }),
  },
});

module.exports = mongoose.model('Stories', StoryScheman);
