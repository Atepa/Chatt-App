const mongoose = require("mongoose");

const AccessUsers = mongoose.Schema(
    {
        storyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stories',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("AccessUsersStory", AccessUsers);
