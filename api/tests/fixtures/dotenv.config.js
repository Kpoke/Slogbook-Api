require("dotenv").config({ path: "./api/tests/tests.env" });

jest.setTimeout(30000);

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
