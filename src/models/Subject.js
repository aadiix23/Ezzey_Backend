const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  name: String,
  credits: Number,
  weeklyHours: Number
});

module.exports = mongoose.model("Subject", subjectSchema);
