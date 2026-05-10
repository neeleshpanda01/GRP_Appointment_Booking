const router = require("express").Router();
const ctrl = require("../controllers/doctor.controller");

router.post("/", ctrl.addDoctor);
router.get("/", ctrl.getDoctors);
router.get("/appointments", ctrl.getAppointments);

module.exports = router;