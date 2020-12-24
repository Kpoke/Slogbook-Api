const mongoose = require("mongoose");
const passwordHash = require("./passwordPlugin");

var industrySupervisorSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  name: String,
  phoneNumber: Number,
  companyName: String,
  email: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    default: "IndustrySupervisor",
  },
  post: String,
  avatarPublicId: String,
  avatarUrl: String,
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

industrySupervisorSchema.plugin(passwordHash);

module.exports = mongoose.model("IndustrySupervisor", industrySupervisorSchema);
