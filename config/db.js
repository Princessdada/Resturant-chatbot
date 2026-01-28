const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URL = process.env.MONGO_DB_CONNECTION_URL;

function connectToMongodb() {
  mongoose.connect(MONGODB_URL);
  mongoose.connection.on("connected", () => {
    console.log("connected to mongodb sucessfully");
  });
  mongoose.connection.on("error", (err) => {
    console.log("Error connecting to mongodb", err);
  });
}

module.exports = { connectToMongodb };
