const Supervisor = require("../../../models/supervisor");
const Student = require("../../../models/student");
const jwt = require("jsonwebtoken");

const { generateError } = require("../utilities");

module.exports = async (supervisorId, formData) => {
  let flag = await Student.exists({ matricNumber: formData.matric });
  if (!flag) {
    let supervisor = await Supervisor.findById(supervisorId);
    if (!supervisor) {
      return generateError("User not Authorized to Perform this Action", 422);
    }
    let user = new Student({
      name: formData.name,
      username: formData.username,
      password: formData.password,
      matricNumber: formData.matric,
      courseOfStudy: formData.course,
      session: formData.session,
      levelDuringTraining: formData.level,
      email: formData.email,
      frequency: supervisor.frequency,
    });

    supervisor.student.push(user._id);
    supervisor.save();
    user.save();

    jwt.sign({ userid: user._id }, process.env.STUDENTKEY);
    return { user };
  }

  return generateError("Student Matric Number already exists", 422);
};
