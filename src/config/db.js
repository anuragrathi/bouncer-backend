const mongoose = require("mongoose");
require("dotenv").config();

const mongodbUrl = process.env.MONGO_URI;

const connectDb = () => {
  console.log("📡 Connecting to MongoDB...");
  return mongoose.connect(mongodbUrl);
};

module.exports = { connectDb };
