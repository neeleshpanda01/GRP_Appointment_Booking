const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");

// add doctor
exports.addDoctor = async (req, res) => {
  const doc = await Doctor.create(req.body);
  res.json(doc);
};

// get doctors
exports.getDoctors = async (req, res) => {
  const data = await Doctor.find();
  res.json(data);
};

// admin: view all appointments
exports.getAppointments = async (req, res) => {
  const data = await Appointment.find();
  res.json(data);
};