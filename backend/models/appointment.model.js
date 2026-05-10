const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  doctorId: String,
  date: String,
  time: String,
  status: { type: String, default: "booked" }
});

module.exports = mongoose.model("Appointment", schema);