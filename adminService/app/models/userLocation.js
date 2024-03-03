const mongoose = require('mongoose');

const userLocationSchema = mongoose.Schema({
  locationCountry: String,
  locationPostCode: Number,
  locationAddress: String,
}, {
  _id: false,
  versionKey: false,
});

module.exports = userLocationSchema;
