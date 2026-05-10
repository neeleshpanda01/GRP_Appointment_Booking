const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  experience: Number,
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  image: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);