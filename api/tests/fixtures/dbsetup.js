const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Admin = require("../../../models/admin");
const Supervisor = require("../../../models/supervisor");
const Chat = require("../../../models/chat");
const Student = require("../../../models/student");
const IndustrySupervisor = require("../../../models/industrysuper");

const adminOneId = new mongoose.Types.ObjectId();
const adminOne = {
  _id: adminOneId,
  username: "University of Kentucky",
  password: "password",
};
const adminOneToken = jwt.sign({ userid: adminOneId }, process.env.ADMINKEY);

const supervisorOneId = new mongoose.Types.ObjectId();
const supervisorOne = {
  _id: supervisorOneId,
  name: "Hatake Kakashi",
  username: "Hkakashi",
  password: "password",
  frequency: "Weekly",
  email: "Hkakashi@yahoo.com",
};
const supervisorOneToken = jwt.sign(
  { userid: supervisorOneId },
  process.env.SUPERVISORKEY
);

const chatOneId = new mongoose.Types.ObjectId();
const chatOne = {
  _id: chatOneId,
  report: "Very first report ",
  isReport: false,
  date: "11/31/2020",
};

const chatTwoReportId = new mongoose.Types.ObjectId();
const chatTwoReport = {
  _id: chatTwoReportId,
  report: "Very second report ",
  isReport: true,
  date: "12/31/2020",
  imagePublicId: "String",
  imageUrl: "String",
};

const studentOneId = new mongoose.Types.ObjectId();
const studentOne = {
  _id: studentOneId,
  name: "Uzumaki Naruto",
  username: "Unaruto",
  password: "password",
  matricNumber: 192110,
  courseOfStudy: "Becoming Hokage ",
  session: "2019/2020",
  levelDuringTraining: 400,
  email: "UzumakiNaruto@gmail.com",
  frequency: "Daily",
};
const studentOneToken = jwt.sign(
  { userid: studentOneId },
  process.env.STUDENTKEY
);

const studentTwoId = new mongoose.Types.ObjectId();
const studentTwo = {
  _id: studentTwoId,
  name: "Ero Sannin",
  username: "Esannin",
  password: "password",
  matricNumber: 192111,
  courseOfStudy: "Sake, Money and Booze ",
  session: "2019/2020",
  levelDuringTraining: 400,
  email: "EroSannin@gmail.com",
  frequency: "Daily",
  address: "Anywhere bro",
  allowance: "150000",
  phoneNumber: 2348142216261,
  startDate: "10/24/2020",
  companyName: "Team 7",
  companyLocation: "Hidden Village",
  companyNumber: 2348142216263,
  dateArray: ["3/12/2020", "10/12/2020", "17/12/2020"],
};
const studentTwoToken = jwt.sign(
  { userid: studentTwoId },
  process.env.STUDENTKEY
);

const industrySupervisorOneId = new mongoose.Types.ObjectId();
const industrySupervisorOne = {
  _id: industrySupervisorOneId,
  name: "Yamato",
  username: "Yamato",
  password: "password",
  email: "Yamato@gmail.com",
  companyName: "Konoha",
};
const industrySupervisorOneToken = jwt.sign(
  { userid: industrySupervisorOneId },
  process.env.INDUSTRYSUPERVISORKEY
);

const setupDatabase = async () => {
  await Admin.deleteMany();
  await Supervisor.deleteMany();
  await Chat.deleteMany();
  await Student.deleteMany();
  await IndustrySupervisor.deleteMany();
  await new Admin(adminOne).save();
  await new Supervisor(supervisorOne).save();
  await new Chat(chatOne).save();
  await new Chat(chatTwoReport).save();
  await new Student(studentOne).save();
  await new Student(studentTwo).save();
  await new IndustrySupervisor(industrySupervisorOne).save();
};

module.exports = {
  adminOneId,
  adminOne,
  adminOneToken,
  supervisorOne,
  supervisorOneId,
  supervisorOneToken,
  chatOneId,
  chatOne,
  chatTwoReportId,
  chatTwoReport,
  studentOne,
  studentOneId,
  studentOneToken,
  studentTwo,
  studentTwoId,
  studentTwoToken,
  industrySupervisorOne,
  industrySupervisorOneId,
  industrySupervisorOneToken,
  setupDatabase,
};
