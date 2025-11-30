const Schedule = require("../models/Schedule");
const { checkScheduleConflicts } = require("../utils/scheduleHelpers");

exports.createSchedule = async (req, res) => {
  try {
    const { type, date, startTime, endTime, period, duration, subject, faculty, classroom, batch, department, description, status } = req.body;

    const conflicts = await checkScheduleConflicts(faculty, classroom, batch, date, startTime, endTime);

    if (conflicts.facultyConflict) {
      return res.status(409).json({
        success: false,
        message: "Faculty already scheduled for another class/test/exam at this time",
        conflict: {
          type: "faculty",
          conflictingSchedule: {
            id: conflicts.conflictingSchedule._id,
            type: conflicts.conflictingSchedule.type,
            date: conflicts.conflictingSchedule.date,
            startTime: conflicts.conflictingSchedule.startTime,
            endTime: conflicts.conflictingSchedule.endTime,
            subject: conflicts.conflictingSchedule.subject
          }
        }
      });
    }

    if (conflicts.classroomConflict) {
      return res.status(409).json({
        success: false,
        message: "Classroom already booked at this time",
        conflict: {
          type: "classroom",
          conflictingSchedule: {
            id: conflicts.conflictingSchedule._id,
            type: conflicts.conflictingSchedule.type,
            date: conflicts.conflictingSchedule.date,
            startTime: conflicts.conflictingSchedule.startTime,
            endTime: conflicts.conflictingSchedule.endTime
          }
        }
      });
    }

    if (conflicts.batchConflict) {
      return res.status(409).json({
        success: false,
        message: "Batch already scheduled for another class/test/exam at this time",
        conflict: {
          type: "batch",
          conflictingSchedule: {
            id: conflicts.conflictingSchedule._id,
            type: conflicts.conflictingSchedule.type,
            date: conflicts.conflictingSchedule.date,
            startTime: conflicts.conflictingSchedule.startTime,
            endTime: conflicts.conflictingSchedule.endTime
          }
        }
      });
    }

    const scheduleData = {
      type,
      date: new Date(date),
      startTime,
      endTime,
      subject,
      faculty,
      classroom,
      batch,
      department,
      description: description || "",
      status: status || "scheduled"
    };

    if (type === "class") {
      scheduleData.period = period;
    } else {
      scheduleData.duration = duration;
    }

    const schedule = new Schedule(scheduleData);

    await schedule.save();

    return res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create schedule",
      error: error.message
    });
  }
};

exports.getSchedules = async (req, res) => {
  
  try {
    const { type, date, startDate, endDate, batch, faculty, classroom, department, status } = req.query;

    const query = {};

    if (type) query.type = type;
    if (date) query.date = new Date(date);
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (batch) query.batch = batch;
    if (faculty) query.faculty = faculty;
    if (classroom) query.classroom = classroom;
    if (department) query.department = department;
    if (status) query.status = status;

    const schedules = await Schedule.find(query).sort({ date: 1, startTime: 1 });

    return res.json({
      success: true,
      count: schedules.length,
      data: schedules
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch schedules",
      error: error.message
    });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    return res.json({
      success: true,
      data: schedule
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch schedule",
      error: error.message
    });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const schedule = await Schedule.findById(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    if (updateData.date || updateData.startTime || updateData.endTime || updateData.faculty || updateData.classroom || updateData.batch) {
      const checkDate = updateData.date ? new Date(updateData.date) : schedule.date;
      const checkStartTime = updateData.startTime || schedule.startTime;
      const checkEndTime = updateData.endTime || schedule.endTime;
      const checkFaculty = updateData.faculty || schedule.faculty;
      const checkClassroom = updateData.classroom || schedule.classroom;
      const checkBatch = updateData.batch || schedule.batch;

      const conflicts = await checkScheduleConflicts(checkFaculty, checkClassroom, checkBatch, checkDate, checkStartTime, checkEndTime, id);

      if (conflicts.facultyConflict) {
        return res.status(409).json({
          success: false,
          message: "Faculty already scheduled for another class/test/exam at this time",
          conflict: {
            type: "faculty",
            conflictingSchedule: {
              id: conflicts.conflictingSchedule._id,
              type: conflicts.conflictingSchedule.type,
              date: conflicts.conflictingSchedule.date,
              startTime: conflicts.conflictingSchedule.startTime,
              endTime: conflicts.conflictingSchedule.endTime,
              subject: conflicts.conflictingSchedule.subject
            }
          }
        });
      }

      if (conflicts.classroomConflict) {
        return res.status(409).json({
          success: false,
          message: "Classroom already booked at this time",
          conflict: {
            type: "classroom",
            conflictingSchedule: {
              id: conflicts.conflictingSchedule._id,
              type: conflicts.conflictingSchedule.type,
              date: conflicts.conflictingSchedule.date,
              startTime: conflicts.conflictingSchedule.startTime,
              endTime: conflicts.conflictingSchedule.endTime
            }
          }
        });
      }

      if (conflicts.batchConflict) {
        return res.status(409).json({
          success: false,
          message: "Batch already scheduled for another class/test/exam at this time",
          conflict: {
            type: "batch",
            conflictingSchedule: {
              id: conflicts.conflictingSchedule._id,
              type: conflicts.conflictingSchedule.type,
              date: conflicts.conflictingSchedule.date,
              startTime: conflicts.conflictingSchedule.startTime,
              endTime: conflicts.conflictingSchedule.endTime
            }
          }
        });
      }
    }

    Object.assign(schedule, updateData);
    await schedule.save();

    return res.json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update schedule",
      error: error.message
    });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    return res.json({
      success: true,
      message: "Schedule deleted successfully",
      data: schedule
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete schedule",
      error: error.message
    });
  }
};

exports.checkConflicts = async (req, res) => {
  try {
    const { faculty, classroom, batch, date, startTime, endTime } = req.query;

    const conflicts = await checkScheduleConflicts(faculty, classroom, batch, date, startTime, endTime);

    const hasConflicts = conflicts.facultyConflict || conflicts.classroomConflict || conflicts.batchConflict;

    return res.json({
      success: true,
      hasConflicts,
      conflicts: {
        faculty: conflicts.facultyConflict,
        classroom: conflicts.classroomConflict,
        batch: conflicts.batchConflict
      },
      conflictingSchedule: conflicts.conflictingSchedule ? {
        id: conflicts.conflictingSchedule._id,
        type: conflicts.conflictingSchedule.type,
        date: conflicts.conflictingSchedule.date,
        startTime: conflicts.conflictingSchedule.startTime,
        endTime: conflicts.conflictingSchedule.endTime,
        subject: conflicts.conflictingSchedule.subject,
        faculty: conflicts.conflictingSchedule.faculty,
        classroom: conflicts.conflictingSchedule.classroom,
        batch: conflicts.conflictingSchedule.batch
      } : null
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check conflicts",
      error: error.message
    });
  }
};

