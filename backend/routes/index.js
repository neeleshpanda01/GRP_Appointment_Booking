const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/appointment", require("./appointment.routes"));
router.use("/doctor", require("./doctor.routes"));

module.exports = router;