const mongoose = require("mongoose");

const StoryScheman = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    }, 
    isActive: { type: Boolean, default: true},
    timestamps: true,
  });

module.exports = mongoose.model("Stories", StoryScheman);