const Department = require("../models/Department");
const Subject = require("../models/Subject");
const Faculty = require("../models/Faculty");
const Classroom = require("../models/Classroom");
const Batch = require("../models/Batch");
const Timetable = require("../models/Timetable"); // if exists

exports.getDashboardSummary = async (req, res) => {
  try {
    const totalDepartments = await Department.countDocuments();
    const totalSubjects = await Subject.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalClassrooms = await Classroom.countDocuments();
    const totalBatches = await Batch.countDocuments();

    // For prototype, timetable count fixed or 0 if table not created yet
    let generatedTimetables = 0;
    try {
      generatedTimetables = await Timetable.countDocuments();
    } catch {}

    return res.json({
      success: true,
      summary: {
        departments: totalDepartments,
        subjects: totalSubjects,
        faculty: totalFaculty,
        classrooms: totalClassrooms,
        batches: totalBatches,
        generatedTimetables: generatedTimetables,
        utilization: {
          facultyUtilization: "78%",   // dummy for now
          classroomUtilization: "63%"  // dummy for now
        }
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard", error });
  }
};
