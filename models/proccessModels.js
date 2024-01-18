const mongoose = require('mongoose');

const istanbulTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" });
const istanbulDate = new Date(istanbulTime);
istanbulDate.setHours(istanbulDate.getHours() + 3);

const proccessSchema = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    proccessType: String,
    proccessData1: Number,
    proccessData2: Number,
    proccessResult: Number,
    proccessVisible: { type: Boolean, default: true},
    proccesTime: {type: Date, default: Date.now()},
});
proccessSchema.index({ userId: 1});

const proccesModel = mongoose.model('Proccess',proccessSchema);

module.exports = proccesModel;