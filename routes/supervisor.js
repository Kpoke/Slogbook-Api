const Supervisor = require("../models/supervisor"),
	jwt = require("jsonwebtoken"),
	bcrypt = require("bcrypt"),
	middlewares = require("../middlewares"),
	Chat = require("../models/chat"),
	Student = require("../models/student"),
	Admin = require("../models/admin");

module.exports = app => {
	app.get(
		"/supervisor",
		middlewares.isAuthorized(process.env.SUPERVISORKEY),
		(req, res) => {
			console.log("got here");
			Supervisor.findById(req.userId)
				.populate({
					path: "student",
					populate: { path: "message" }
				})
				.exec(function(err, supervisor) {
					if (err) {
						res.status(422).send({ error: "Supervisor account not found" });
					} else {
						let total = 0;
						supervisor.student.forEach(student => {
							reports = student.message;
							reports.forEach(entry => {
								if (entry.isReport && entry.score) {
									total += entry.score;
								}
							});
							student.score = total;
							student.save();
						});
						res.json({ supervisor });
					}
				});
		}
	);

	//signup route
	app.post(
		"/supervisor/register",
		middlewares.isAuthorized(process.env.ADMINKEY),
		async (req, res) => {
			let name = req.body.authObject.name;
			let username = req.body.authObject.username;
			let password = req.body.authObject.password;
			let frequency = req.body.authObject.frequency;
			let user = new Supervisor({ name, username, password, frequency });
			let flag = await Supervisor.exists({ username });
			if (!flag) {
				let admin = await Admin.findById(req.userId);
				if (!admin) {
					res.status(422).send({ error: "Admin account not found" });
				}

				user.save();
				admin.supervisor.push(user._id);
				admin.save();

				jwt.sign({ userid: user._id }, process.env.SUPERVISORKEY);
				res.send("admin");
			} else {
				res.status(422).send({ error: "Username already exists" });
			}
		}
	);

	app.post("/supervisor/login", async (req, res) => {
		let username = req.body.authObject.username;
		let password = req.body.authObject.password;

		if (!username || !password) {
			return res
				.status(422)
				.send({ error: "Must provide Username and Password" });
		}

		let user = await Supervisor.findOne({ username });
		if (!user) {
			return res.status(422).send({ error: "Invalid Username and Password" });
		}

		let flag = await bcrypt.compare(password, user.password);
		if (!flag) {
			return res.status(422).send({ error: "Invalid Username and Password" });
		}

		const token = jwt.sign({ userid: user._id }, process.env.SUPERVISORKEY);
		res.send({ token });
	});

	app.post(
		"/supervisor/comment",
		middlewares.isAuthorized(process.env.SUPERVISORKEY),
		async (req, res) => {
			let update = {
				score: req.body.score,
				schoolSupervisorsComment: req.body.comment
			};
			let filter = { _id: req.body.messageId };
			let message = await Chat.findOneAndUpdate(filter, update);
			if (!message) {
				return res.status(422).send({ error: "Username Invalid" });
			}
			res.send({ feedback: "Saved" });
		}
	);
};
