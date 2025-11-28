const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  department: String,
  batch: String,
  data: Object,   // timetable matrix
});

module.exports = mongoose.model("Timetable", timetableSchema);
