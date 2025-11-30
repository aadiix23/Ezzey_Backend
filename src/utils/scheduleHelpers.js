const Schedule = require("../models/Schedule");

const hasTimeOverlap = (start1, end1, start2, end2) => {
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  return start1Min < end2Min && start2Min < end1Min;
};

const checkScheduleConflicts = async (faculty, classroom, batch, date, startTime, endTime, excludeId = null) => {
  const conflicts = {
    facultyConflict: false,
    classroomConflict: false,
    batchConflict: false,
    conflictingSchedule: null
  };

  const scheduleDate = new Date(date);
  scheduleDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(scheduleDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const query = {
    date: {
      $gte: scheduleDate,
      $lt: nextDay
    },
    status: { $ne: "cancelled" }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingSchedules = await Schedule.find(query);

  for (const schedule of existingSchedules) {
    if (hasTimeOverlap(startTime, endTime, schedule.startTime, schedule.endTime)) {
      if (schedule.faculty === faculty) {
        conflicts.facultyConflict = true;
        conflicts.conflictingSchedule = schedule;
        return conflicts;
      }

      if (schedule.classroom === classroom) {
        conflicts.classroomConflict = true;
        conflicts.conflictingSchedule = schedule;
        return conflicts;
      }

      if (schedule.batch === batch) {
        conflicts.batchConflict = true;
        conflicts.conflictingSchedule = schedule;
        return conflicts;
      }
    }
  }

  return conflicts;
};

module.exports = {
  hasTimeOverlap,
  checkScheduleConflicts
};

