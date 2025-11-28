const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  room: String,
  type: String,
  capacity: Number
});

module.exports = mongoose.model("Classroom", classroomSchema);
