const mongoose = require("mongoose");
const passwordHash = require("./passwordPlugin");

var StudentSchema = new mongoose.Schema({
	name: String,
	matricNumber: Number,
	username: String,
	password: String,
	courseOfStudy: String,
	session: String,
	levelDuringTraining: Number,
	monthlyAllowance: Number,
	addressDuringTraining: String,
	phoneNumber: Number,
	score: Number,
	startDate: { type: Date, default: new Date() },
	companyName: String,
	companyLocation: String,
	companyPhoneNumber: Number,
	frequency: String,
	dateArray: Array,
	message: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat"
		}
	],
	industrySuper: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "IndustrySupervisor"
		}
	]
});

StudentSchema.plugin(passwordHash);

module.exports = mongoose.model("Student", StudentSchema);
