const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
const erpRoutes = require("./routes/erpRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use(cookieParser());
app.use("/api/erp", erpRoutes);
app.use("/api/dashboard", dashboardRoutes);
module.exports = app;
