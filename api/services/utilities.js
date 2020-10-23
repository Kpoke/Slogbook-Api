const generateError = (message, status) => {
  return { error: message, status };
};

const Admin = require("../../models/admin");
const Student = require("../../models/student");
const Supervisor = require("../../models/supervisor");
const IndustrySupervisor = require("../../models/industrysuper");

const getModel = (key) => {
  switch (key) {
    case process.env.ADMINKEY:
      return Admin;
    case process.env.STUDENTKEY:
      return Student;
    case process.env.SUPERVISORKEY:
      return Supervisor;
    case process.env.INDUSTRYSUPERVISORKEY:
      return IndustrySupervisor;
    default:
      return null;
  }
};

//find whre t put this later
// let total = 0;
//           supervisor.student.forEach((student) => {
//             reports = student.message;
//             reports.forEach((entry) => {
//               if (entry.isReport && entry.score) {
//                 total += entry.score;
//               }
//             });
//             student.score = total;
//             student.save();
//           });

module.exports = { generateError, getModel };
