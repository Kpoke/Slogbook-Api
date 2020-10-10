const mongoose = require("mongoose");
const passwordHash = require("./passwordPlugin");


var SupervisorSchema =new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    student: [
    {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: "Student"
    }

    ],
    frequency: String,
    
});

 SupervisorSchema.plugin(passwordHash);

module.exports = mongoose.model("Supervisor", SupervisorSchema);