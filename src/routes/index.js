const express = require("express");
const router = express.Router();

const erpRoutes = require("./erpRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const scheduleRoutes = require("./scheduleRoutes");
const authRoutes = require("./authRoutes");

router.use("/auth", authRoutes);
router.use("/erp", erpRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/schedule", scheduleRoutes);

module.exports = router;

