const mongoose = require("mongoose");

const mongodb = () => {
  mongoose.connect(process.env.MONGO_URL);
};

module.exports = mongodb;
