const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");

exports.book = async (req, res) => {
  try {
    const { doctorId, date, time, userId } = req.body;

    // Validation
    if (!doctorId || !date || !time || !userId) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    if (!doctor.available) {
      return res.status(400).json({ msg: "Doctor is not available" });
    }

    // Check if slot is already booked
    const exists = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ["booked", "confirmed"] }
    });

    if (exists) {
      return res.status(400).json({ msg: "This slot is already booked" });
    }

    // Create appointment
    const appointment = await Appointment.create({
      doctorId,
      date,
      time,
      userId,
      status: "booked",
      createdAt: new Date()
    });

    res.status(201).json({
      ...appointment.toObject(),
      msg: "Appointment booked successfully"
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("doctorId").lean();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await Appointment.find({ userId }).populate("doctorId").lean();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    res.json({ msg: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};