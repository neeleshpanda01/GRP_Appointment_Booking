const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");

// Add new doctor
exports.addDoctor = async (req, res) => {
  try {
    const { name, specialization, available } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({ msg: "Name and specialization are required" });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      available: available !== undefined ? available : true
    });

    res.status(201).json({
      ...doctor.toObject(),
      msg: "Doctor added successfully"
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().lean();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    res.json({ msg: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Admin: Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().lean();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};