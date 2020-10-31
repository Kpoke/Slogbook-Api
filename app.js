require("dotenv").config();
const express = require("express"),
  Admin = require("./models/admin"),
  Student = require("./models/student"),
  Supervisor = require("./models/supervisor"),
  IndustrySupervisor = require("./models/industrysuper"),
  Chat = require("./models/chat"),
  mongoose = require("mongoose"),
  app = express(),
  router = express.Router();

//clearDB();
mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

router.use(express.json());
const routes = require("./api/routes")(router);
app.use("/api", routes);

app.listen(process.env.PORT, function () {
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
