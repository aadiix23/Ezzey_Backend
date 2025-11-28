const dummyERP = require("../dummy/dummyERP");

const Department = require("../models/Department");
const Subject = require("../models/Subject");
const Faculty = require("../models/Faculty");
const Classroom = require("../models/Classroom");
const Batch = require("../models/Batch");

// ===================== CONNECT ERP =====================
exports.connectERP = (req, res) => {
  return res.json({
    connected: true,
    institution: "Demo College ERP",
    message: "ERP connected successfully!"
  });
};


// ===================== SYNC ERP DATA =====================
exports.syncERP = async (req, res) => {
  try {
    // Clear old data (optional)
    await Department.deleteMany({});
    await Subject.deleteMany({});
    await Faculty.deleteMany({});
    await Classroom.deleteMany({});
    await Batch.deleteMany({});

    // Insert dummy data
    await Department.insertMany(dummyERP.departments);
    await Subject.insertMany(dummyERP.subjects);
    await Faculty.insertMany(dummyERP.faculty);
    await Classroom.insertMany(dummyERP.classrooms);
    await Batch.insertMany(dummyERP.batches);

    return res.json({
      message: "ERP Sync Completed!",
      synced: true,
      summary: {
        departments: dummyERP.departments.length,
        subjects: dummyERP.subjects.length,
        faculty: dummyERP.faculty.length,
        classrooms: dummyERP.classrooms.length,
        batches: dummyERP.batches.length
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "ERP Sync Failed", error });
  }
};


// ===================== STEP STATUS =====================
exports.syncStatus = async (req, res) => {
  return res.json({
    success: true,
    steps: [
      { step: "Connecting to ERP", status: "completed" },
      { step: "Fetching Departments", status: "completed" },
      { step: "Fetching Subjects", status: "completed" },
      { step: "Fetching Faculty", status: "completed" },
      { step: "Fetching Classrooms", status: "completed" },
      { step: "Fetching Batches", status: "completed" },
      { step: "Validating Loadset", status: "completed" }
    ],
    finalStatus: "ERP Data Sync Completed Successfully"
  });
};
