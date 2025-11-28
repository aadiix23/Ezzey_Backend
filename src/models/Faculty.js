const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: String,
  subjects: [String],
  leaves: Number
});

module.exports = mongoose.model("Faculty", facultySchema);
