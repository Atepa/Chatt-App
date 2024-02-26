const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = async function connect() {
  await mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      console.log('Connect');
    })
    .catch((err) => {
      console.log(err.message);
    });
};
