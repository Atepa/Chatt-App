const mongoose = require('mongoose');

const AccessUsers = mongoose.Schema(
  {
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stories',
      required: true,
    },
    accesUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
          required: true,
        },
        timestamp: {
          type: Date,
          default: () => new Date(Date.now() + (3 * 60 * 60 * 1000)),
        },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => new Date(Date.now() + (3 * 60 * 60 * 1000)),
    },
  },
);

module.exports = mongoose.model('accessusersstory', AccessUsers);
