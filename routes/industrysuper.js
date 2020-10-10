const IndustrySupervisor = require("../models/industrysuper"),
	Chat = require("../models/chat"),
	middlewares = require("../middlewares"),
	jwt = require("jsonwebtoken"),
	bcrypt = require("bcrypt");

module.exports = app => {
	app.get(
		"/industrysupervisor",
		middlewares.isAuthorized(process.env.INDUSTRYSUPERVISORKEY),
		(req, res) => {
			IndustrySupervisor.findById(req.userId)
				.populate({
					path: "student",
					populate: { path: "message" }
				})
				.exec(function(err, industrySuper) {
					if (err) {
						res.status(422).send({ err });
					} else {
						res.json({ industrySuper });
					}
				});
		}
	);

	app.post("/industrysupervisor/login", async (req, res) => {
		let username = req.body.authObject.username;
		let password = req.body.authObject.password;

		if (!username || !password) {
			return res
				.status(422)
				.send({ error: "Must provide Username and Password" });
		}

		let user = await IndustrySupervisor.findOne({ username });
		if (!user) {
			return res.status(422).send({ error: "Invalid Username or Password" });
		}

		let flag = await bcrypt.compare(password, user.password);
		if (!flag) {
			return res.status(422).send({ error: "Invalid Username or Password" });
		}

		const token = jwt.sign(
			{ userid: user._id },
			process.env.INDUSTRYSUPERVISORKEY
		);
		res.send({ token });
	});

	app.post(
		"/industrysupervisor/comment",
		middlewares.isAuthorized(process.env.INDUSTRYSUPERVISORKEY),
		async (req, res) => {
			let update = {
				industrySupervisorsComment: req.body.comment
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
