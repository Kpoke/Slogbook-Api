const mongoose = require("mongoose");
const passwordHash = require("./passwordPlugin");


var industrySupervisorSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    phoneNumber: Number,
    email: String,
    post: String,
    student: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }
    ]
});

industrySupervisorSchema.plugin(passwordHash);

module.exports = mongoose.model("IndustrySupervisor", industrySupervisorSchema);