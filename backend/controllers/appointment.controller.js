const Appointment = require("../models/appointment.model");

exports.book = async (req, res) => {
  const { doctorId, date, time, userId } = req.body;

  const exists = await Appointment.findOne({
    doctorId, date, time, status: "booked"
  });

  if (exists) return res.json({ msg: "Slot already booked" });

  const data = await Appointment.create(req.body);
  res.json(data);
};

exports.getAll = async (req, res) => {
  const data = await Appointment.find();
  res.json(data);
};

exports.cancel = async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, {
    status: "cancelled"
  });
  res.json({ msg: "Cancelled" });
};