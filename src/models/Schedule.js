const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["class", "test", "exam"],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  period: {
    type: Number,
    required: function() {
      return this.type === "class";
    }
  },
  duration: {
    type: Number, 
    required: function() {
      return this.type === "test" || this.type === "exam";
    }
  },
  subject: {
    type: String,
    required: true
  },
  faculty: {
    type: String,
    required: true
  },
  classroom: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["scheduled", "cancelled", "completed"],
    default: "scheduled"
  }
}, {
  timestamps: true
});

scheduleSchema.index({ faculty: 1, date: 1, startTime: 1, endTime: 1 });
scheduleSchema.index({ classroom: 1, date: 1, startTime: 1, endTime: 1 });
scheduleSchema.index({ batch: 1, date: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model("Schedule", scheduleSchema);


