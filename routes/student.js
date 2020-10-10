const Student = require("../models/student"),
	IndustrySupervisor = require("../models/industrysuper"),
	Supervisor = require("../models/supervisor"),
	Chat = require("../models/chat"),
	jwt = require("jsonwebtoken"),
	bcrypt = require("bcrypt"),
	mime = require("mime-types"),
	middlewares = require("../middlewares");

module.exports = app => {
	//home route
	app.get(
		"/student",
		middlewares.isAuthorized(process.env.STUDENTKEY),
		(req, res) => {
			console.log("got here student");
			Student.findById(req.userId)
				.populate("message")
				.exec(function(err, student) {
					if (err) {
						res.status(422).send({ err });
					} else {
						res.json({ student });
					}
				});
		}
	);

	//signup route
	app.post(
		"/student/register",
		middlewares.isAuthorized(process.env.SUPERVISORKEY),
		async (req, res) => {
			let supervisor = await Supervisor.findById(req.userId);
			if (!supervisor) {
				return res.status(422).send({ error: "Supervisor account not found" });
			}
			let newStudent = new Student({
				name: req.body.authObject.name,
				username: req.body.authObject.username,
				password: req.body.authObject.password,
				matricNumber: req.body.authObject.matric,
				courseOfStudy: req.body.authObject.course,
				session: req.body.authObject.session,
				levelDuringTraining: req.body.authObject.level,
				frequency: supervisor.frequency
			});

			let flag = await Student.exists({
				matricNumber: req.body.authObject.matric
			});

			if (flag) {
				return res.status(422).send({ error: "Matric number already exists" });
			}
			jwt.sign({ userid: newStudent._id }, process.env.STUDENTKEY);
			newStudent.save();
			supervisor.student.push(newStudent._id);
			supervisor.save();
			res.send({ feedback: "Student Saved" });
		}
	);

	app.post(
		"/studentUpdate/register",
		middlewares.isAuthorized(process.env.STUDENTKEY),
		async (req, res) => {
			console.log("got here");
			let updateStudent = {
				addressDuringTraining: req.body.authObject.address,
				monthlyAllowance: req.body.authObject.allowance,
				phoneNumber: req.body.authObject.phoneNumber,
				startDate: new Date(req.body.authObject.startDate),
				companyName: req.body.authObject.companyName,
				companyLocation: req.body.authObject.companyLocation,
				companyPhoneNumber: req.body.authObject.companyNumber
			};

			let newIndustrySuper = new IndustrySupervisor({
				name: req.body.authObject.authIndustryObject.industrySuperName,
				username: req.body.authObject.authIndustryObject.industrySuperUsername,
				password: req.body.authObject.authIndustryObject.industrySuperPassword,
				phoneNumber:
					req.body.authObject.authIndustryObject.industrySuperPhoneNumber,
				post: req.body.authObject.authIndustryObject.industrySuperPost,
				email: req.body.authObject.authIndustryObject.industrySuperEmail
			});

			let filter = { _id: req.userId };
			let student = await Student.findOneAndUpdate(filter, updateStudent, {
				new: true
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
		}
	);

	app.post("/student/login", async (req, res) => {
		let username = req.body.authObject.username;
		let password = req.body.authObject.password;

		if (!username || !password) {
			return res
				.status(422)
				.send({ error: "Must provide Username and Password" });
		}

		let user = await Student.findOne({ username });
		if (!user) {
			return res.status(422).send({ error: "Invalid Username and Password" });
		}

		let flag = await bcrypt.compare(password, user.password);
		if (!flag) {
			return res.status(422).send({ error: "Invalid Username and Password" });
		}

		const token = jwt.sign({ userid: user._id }, process.env.STUDENTKEY);
		res.send({ token });
	});

	app.post(
		"/student/message",
		middlewares.isAuthorized(process.env.STUDENTKEY),
		(req, res) => {
			Student.findById(req.userId)
				.populate("message")
				.exec(function(err, student) {
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
		}
	);

	app.post(
		"/student/sendarray",
		middlewares.isAuthorized(process.env.STUDENTKEY),
		async (req, res) => {
			let update = { dateArray: req.body.dateArray };
			let filter = { _id: req.userId };
			let student = await Student.findOneAndUpdate(filter, update);
			if (!student) {
				return res.status(422).send({ error: "Username Invalid" });
			}
			res.send({ feedback: "Saved" });
		}
	);

	app.post(
		"/student/image",
		middlewares.isAuthorized(process.env.STUDENTKEY),
		async (req, res) => {
			let image = req.body.image;
			console.log(mime.lookup(image));
		}
	);
};
