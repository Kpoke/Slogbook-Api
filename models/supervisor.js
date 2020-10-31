const mongoose = require("mongoose");
const passwordHash = require("./passwordPlugin");

var SupervisorSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
  },
  password: String,
  student: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  frequency: String,
  email: {
    type: String,
    unique: true,
  },
});

SupervisorSchema.plugin(passwordHash);

module.exports = mongoose.model("Supervisor", SupervisorSchema);
