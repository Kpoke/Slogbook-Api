const mongoose = require("mongoose");
const passwordHash = require("./passwordPlugin");

var AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatarPublicId: String,
  avatarUrl: String,
  isAdmin: {
    type: Boolean,
    default: true,
  },
  supervisor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
    },
  ],
});

AdminSchema.plugin(passwordHash);

module.exports = mongoose.model("Admin", AdminSchema);
