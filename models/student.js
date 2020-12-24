const mongoose = require("mongoose");
const passwordHash = require("./passwordPlugin");

var StudentSchema = new mongoose.Schema({
  name: String,
  matricNumber: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: String,
  courseOfStudy: String,
  session: String,
  levelDuringTraining: Number,
  monthlyAllowance: Number,
  addressDuringTraining: String,
  phoneNumber: Number,
  email: {
    type: String,
    unique: true,
  },
  score: Number,
  startDate: { type: Date, default: new Date() },
  companyName: String,
  companyLocation: String,
  companyPhoneNumber: Number,
  frequency: String,
  dateArray: Array,
  avatarPublicId: String,
  avatarUrl: String,
  role: {
    type: String,
    default: "Student",
  },
  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
  industrySuper: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IndustrySupervisor",
    },
  ],
});

StudentSchema.plugin(passwordHash);

module.exports = mongoose.model("Student", StudentSchema);
