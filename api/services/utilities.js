const Admin = require("../../models/admin");
const Student = require("../../models/student");
const Supervisor = require("../../models/supervisor");
const IndustrySupervisor = require("../../models/industrysuper");

const getModel = (key, getPopulateObject) => {
  const {
    populateObject: adminPopulateObject,
  } = require("../controllers/admin");
  const {
    populateObject: industrysuperPopulateObject,
  } = require("../controllers/industrysuper");
  const {
    populateObject: studentPopulateObject,
  } = require("../controllers/student");
  const {
    populateObject: supervisorPopulateObject,
  } = require("../controllers/supervisor");
  const returnObject = (Model, populateObject) => {
    return getPopulateObject ? { Model, populateObject } : Model;
  };
  switch (key) {
    case process.env.ADMINKEY:
      return returnObject(Admin, adminPopulateObject);
    case process.env.STUDENTKEY:
      return returnObject(Student, studentPopulateObject);
    case process.env.SUPERVISORKEY:
      return returnObject(Supervisor, supervisorPopulateObject);
    case process.env.INDUSTRYSUPERVISORKEY:
      return returnObject(IndustrySupervisor, industrysuperPopulateObject);
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
  console.log(date);
  console.log("======");
  console.log(frequency);
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
  console.log("got here..........");
  if (dateArray.length > 0) {
    console.log("dateArray is not empty");
  }
  return dateArray;
};

module.exports = { generateError, getModel, generateDateArray };
