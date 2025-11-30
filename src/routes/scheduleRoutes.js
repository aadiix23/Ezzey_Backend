const express = require("express");
const router = express.Router();

const {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  checkConflicts
} = require("../controllers/scheduleController");

const {
  validateCreateSchedule,
  validateUpdateSchedule,
  validateConflictCheck
} = require("../validate/validateSchedule");

router.post("/", validateCreateSchedule, createSchedule);
router.get("/", getSchedules);
router.get("/conflicts/check", validateConflictCheck, checkConflicts);
router.get("/:id", getScheduleById);
router.put("/:id", validateUpdateSchedule, updateSchedule);
router.delete("/:id", deleteSchedule);

module.exports = router;


