const Student = require("../../models/student"),
  IndustrySupervisor = require("../../models/industrysuper"),
  Supervisor = require("../../models/supervisor"),
  Chat = require("../../models/chat"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  login = require("../services/login"),
  mime = require("mime-types"),
  middlewares = require("../../middlewares");

module.exports = {
  //home route
  home: (req, res) => {
    try {
      const populateObject = "message";
      const result = home(req.userId, populateObject, process.env.STUDENTKEY);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ user: result.user });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
  //signup route
  register: async (req, res) => {
    let supervisor = await Supervisor.findById(req.userId);
    if (!supervisor) {
      return res.status(422).send({ error: "Supervisor account not found" });
    }
    let newStudent = new Student({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      matricNumber: req.body.matric,
      courseOfStudy: req.body.course,
      session: req.body.session,
      levelDuringTraining: req.body.level,
      frequency: supervisor.frequency,
    });
    let flag = await Student.exists({
      matricNumber: req.body.matric,
    });
    if (flag) {
      return res.status(422).send({ error: "Matric number already exists" });
    }
    jwt.sign({ userid: newStudent._id }, process.env.STUDENTKEY);
    newStudent.save();
    supervisor.student.push(newStudent._id);
    supervisor.save();
    res.send({ feedback: "Student Saved" });
  },

  update: async (req, res) => {
    console.log("got here");
    let updateStudent = {
      addressDuringTraining: req.body.address,
      monthlyAllowance: req.body.allowance,
      phoneNumber: req.body.phoneNumber,
      startDate: new Date(req.body.startDate),
      companyName: req.body.companyName,
      companyLocation: req.body.companyLocation,
      companyPhoneNumber: req.body.companyNumber,
    };
    let newIndustrySuper = new IndustrySupervisor({
      name: req.body.authIndustryObject.industrySuperName,
      username: req.body.authIndustryObject.industrySuperUsername,
      password: req.body.authIndustryObject.industrySuperPassword,
      phoneNumber: req.body.authIndustryObject.industrySuperPhoneNumber,
      post: req.body.authIndustryObject.industrySuperPost,
      email: req.body.authIndustryObject.industrySuperEmail,
    });
    let filter = { _id: req.userId };
    let student = await Student.findOneAndUpdate(filter, updateStudent, {
      new: true,
    });
    newIndustrySuper.student.push(student._id);
    newIndustrySuper.save();
    student.industrySuper.push(newIndustrySuper._id);
    student.save();
    jwt.sign(
      { userid: newIndustrySuper._id },
      process.env.INDUSTRYSUPERVISORKEY
    );
    if (!student) {
      return res.status(422).send({ error: "Username Invalid" });
    }
    res.send("student");
  },

  login: async (req, res) => {
    try {
      const result = await login(req.body, process.env.STUDENTKEY);
      if (result.error)
        return res.status(result.status).send({ error: result.error });

      res.send({ token: result.token });
    } catch (e) {
      res.status(500).send(e.message);
    }
  },
  message: (req, res) => {
    Student.findById(req.userId)
      .populate("message")
      .exec(function (err, student) {
        if (err) {
          req.flash("error", err.message);
        } else {
          let report = req.body.messageObject.report;
          let date = req.body.messageObject.date;
          let isReport = req.body.messageObject.isReport;
          let photo = req.body.messageObject.photo;
          var newMessage = { report, date, isReport, photo };
          Chat.create(newMessage, (err, text) => {
            if (err) {
              req.status(422).send({ err });
            } else {
              student.message.push(text);
              student.save();
              res.send({ student, feedback: "Entry Successfully saved" });
            }
          });
        }
      });
  },

  // app.post(
  // 	"/student/sendarray",
  // 	middlewares.isAuthorized(process.env.STUDENTKEY),
  // 	async (req, res) => {
  // 		let update = { dateArray: req.body.dateArray };
  // 		let filter = { _id: req.userId };
  // 		let student = await Student.findOneAndUpdate(filter, update);
  // 		if (!student) {
  // 			return res.status(422).send({ error: "Username Invalid" });
  // 		}
  // 		res.send({ feedback: "Saved" });
  // 	}
  // );
  // app.post(
  // 	"/student/image",
  // 	middlewares.isAuthorized(process.env.STUDENTKEY),
  // 	async (req, res) => {
  // 		let image = req.body.image;
  // 		console.log(mime.lookup(image));
  // 	}
  // );
};
