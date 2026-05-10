const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  specialization: String,
  available: { type: Boolean, default: true }
});

module.exports = mongoose.model("Doctor", schema);