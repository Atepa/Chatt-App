const mongoose = require('mongoose');

const userLocationSchema = mongoose.Schema(
  {
    locationCountry: String,
    locationPostCode: Number,
    locationAddress: String,
  },
  { _id: false }, // _id: false ile ID atanmasını engeller
);

module.exports = userLocationSchema;
