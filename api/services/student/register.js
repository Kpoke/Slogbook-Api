const Supervisor = require("../../../models/supervisor");
const Student = require("../../../models/student");
const jwt = require("jsonwebtoken");

const { generateError } = require("../utilities");

module.exports = async (supervisorId, formData, populateObject) => {
  let flag = await Student.exists({ matricNumber: formData.matric });
  let flag2 = await Student.exists({ email: formData.email });
  let flag3 = await Student.exists({ username: formData.username });
  if (flag2) {
    return generateError("Student Email already exists", 422);
  }
  if (flag3) {
    return generateError("Student Username already exists", 422);
  }
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
    await supervisor.save();
    await user.save();

    jwt.sign({ userid: user._id }, process.env.STUDENTKEY);
    return {
      user: await Supervisor.findById(supervisorId).populate(populateObject),
    };
  }

  return generateError("Student Matric Number already exists", 422);
};
