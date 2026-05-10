const router = require("express").Router();
const ctrl = require("../controllers/appointment.controller");

router.post("/", ctrl.book);
router.get("/", ctrl.getAll);
router.put("/cancel/:id", ctrl.cancel);

module.exports = router;