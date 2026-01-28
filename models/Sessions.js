const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  currentOrder: { type: Array, default: [] },
  orderHistory: { type: Array, default: [] },
  state: { type: String, default: "IDLE" },
  paymentReference: { type: String },
});

module.exports = mongoose.model("Session", sessionSchema);
