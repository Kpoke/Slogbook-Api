const mongoose = require("mongoose");
const passwordHash = require("./passwordPlugin");

var SupervisorSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
  },
  password: String,
  isSupervisor: {
    type: Boolean,
    default: true,
  },
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  frequency: String,
  avatarPublicId: String,
  avatarUrl: String,
  email: {
    type: String,
    unique: true,
  },
});

SupervisorSchema.plugin(passwordHash);

module.exports = mongoose.model("Supervisor", SupervisorSchema);
