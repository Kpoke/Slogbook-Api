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

const generateError = (message, status) => {
  return { error: message, status };
};

const generateDateArray = (startDate, frequency) => {
  Date.prototype.addDay = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  let dateArray = [];
  let i = 0;
  date = new Date(startDate);
  if (frequency == "Daily") {
    while (i < 183) {
      dateArray.push(date);
      if (date.getDay() == 6 || date.getDay() == 0) {
        dateArray.pop();
      }
      date = date.addDay(1);
      i++;
    }
  }
  if (frequency === "Weekly") {
    while (i < 26) {
      dateArray.push(date);
      date = date.addDay(7);
      i++;
    }
  }
  return dateArray;
};

module.exports = { generateError, getModel, generateDateArray };
