require("dotenv").config();
const express = require("express"),
	bodyParser = require("body-parser"),
	Admin = require("./models/admin"),
	Student = require("./models/student"),
	Supervisor = require("./models/supervisor"),
	IndustrySupervisor = require("./models/industrysuper"),
	Chat = require("./models/chat"),
	mongoose = require("mongoose"),
	faker = require("faker"),
	app = express();

//clearDB();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
require("./routes/admin")(app);
require("./routes/student")(app);
require("./routes/supervisor")(app);
require("./routes/industrysuper")(app);

mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
});

app.listen(process.env.PORT, function() {
	console.log("Up and running");
});

// 	const clearDB = () => {
// 		Admin.deleteMany({}, err => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("seeded");
// 			}
// 		});
// 		Supervisor.deleteMany({}, err => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("seeded");
// 			}
// 		});
// 		IndustrySupervisor.deleteMany({}, err => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("seeded");
// 			}
// 		});
// 		Student.deleteMany({}, err => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("seeded");
// 			}
// 		});
// 		Chat.deleteMany({}, err => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("seeded");
// 			}
// 		});
// 	};

// 	// clearDB();
// }
