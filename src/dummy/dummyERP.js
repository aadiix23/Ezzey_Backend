module.exports = {
  departments: [
    { name: "Computer Science" },
    { name: "IT" },
    { name: "Mechanical" }
  ],

  subjects: [
    { name: "Data Structures", credits: 4 },
    { name: "Operating Systems", credits: 3 },
    { name: "DBMS", credits: 3 }
  ],

  faculty: [
    { name: "Dr. Sharma", subjects: ["DS", "OS"], leaves: 2 },
    { name: "Prof. Alok", subjects: ["DBMS"], leaves: 1 }
  ],

  classrooms: [
    { room: "101", type: "Lecture", capacity: 60 },
    { room: "Lab-1", type: "Lab", capacity: 30 }
  ],

  batches: [
    { name: "CSE 3rd Year" },
    { name: "CSE 2nd Year" }
  ]
};
