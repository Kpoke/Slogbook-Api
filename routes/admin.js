const Admin = require("../models/admin"),
	jwt = require("jsonwebtoken"),
	bcrypt = require("bcrypt"),
	middlewares = require("../middlewares");

module.exports = app => {
	app.get(
		"/admin",
		middlewares.isAuthorized(process.env.ADMINKEY),
		(req, res) => {
			console.log("Got to this admin route");
			Admin.findOne({ _id: req.userId })
				.populate("supervisor")
				.exec(function(err, admin) {
					if (err) {
						console.log("error:" + err.message);
					} else {
						res.json({ admin });
					}
				});
		}
	);

	//signup logic
	app.post("/register", async (req, res) => {
		let username = req.body.authObject.username;
		let password = req.body.authObject.password;
		if (!username || !password) {
			return res
				.status(422)
				.send({ error: "Must provide Username and Password" });
		}
		const user = new Admin({ username, password });
		let flag = await Admin.exists({ username: username });
		if (!flag) {
			await user.save();
			const token = jwt.sign({ userid: user._id }, process.env.ADMINKEY);
			res.send({ token });
		} else {
			res.status(422).send({ error: "Username already exists" });
		}
	});

	// //Login Routes

	app.post("/login", async (req, res) => {
		let username = req.body.authObject.username;
		let password = req.body.authObject.password;

		if (!username || !password) {
			return res
				.status(422)
				.send({ error: "Must provide Username and Password" });
		}

		let admin = await Admin.findOne({ username });
		if (!admin) {
			return res.status(422).send({ error: "Invalid Username and Password" });
		}

		let flag = await bcrypt.compare(password, admin.password);
		if (!flag) {
			return res.status(422).send({ error: "Invalid Username and Password" });
		}

		const token = jwt.sign({ userid: admin._id }, process.env.ADMINKEY);
		res.send({ token });
	});
};
