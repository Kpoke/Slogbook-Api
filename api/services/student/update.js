const IndustrySupervisor = require("../../../models/industrysuper");
const Student = require("../../../models/student");
const jwt = require("jsonwebtoken");

const { generateError, generateDateArray } = require("../utilities");

module.exports = async (studentId, formData) => {
  let updateStudent = {
    addressDuringTraining: formData.address,
    monthlyAllowance: formData.allowance,
    phoneNumber: formData.phoneNumber,
    startDate: new Date(formData.startDate),
    companyName: formData.companyName,
    companyLocation: formData.companyLocation,
    companyPhoneNumber: formData.companyNumber,
  };
  let newIndustrySuper;
  let student = await Student.findById(studentId);

  if (!student) {
    return generateError("User does not exists", 422);
  }

  if (student.dateArray.length) {
    return generateError("Student Information cannnot be updated again", 422);
  }

  let industrySuper = await IndustrySupervisor.findOne({
    name: formData.authIndustryObject.industrySuperName,
    companyName: formData.companyName,
  });

  if (industrySuper) {
    newIndustrySuper = industrySuper;
  } else {
    let flag1 = await IndustrySupervisor.exists({
      username: formData.authIndustryObject.industrySuperUsername,
    });
    let flag2 = await IndustrySupervisor.exists({
      email: formData.authIndustryObject.industrySuperEmail,
    });
    if (flag1) {
      return generateError("Industry Supervisor username already exists", 422);
    }
    if (flag2) {
      return generateError("Industry Supervisor Email already exists", 422);
    }
    newIndustrySuper = new IndustrySupervisor({
      name: formData.authIndustryObject.industrySuperName,
      username: formData.authIndustryObject.industrySuperUsername,
      password: formData.authIndustryObject.industrySuperPassword,
      companyName: formData.companyName,
      phoneNumber: formData.authIndustryObject.industrySuperPhoneNumber,
      post: formData.authIndustryObject.industrySuperPost,
      email: formData.authIndustryObject.industrySuperEmail,
    });
  }

  let dateArray = generateDateArray(formData.startDate, student.frequency);
  student.dateArray = [...dateArray];
  Object.assign(student, updateStudent);
  newIndustrySuper.student.push(student._id);
  student.industrySuper.push(newIndustrySuper._id);
  await student.save();
  await newIndustrySuper.save();
  jwt.sign({ userid: newIndustrySuper._id }, process.env.INDUSTRYSUPERVISORKEY);

  return { student, industrysupervisor: newIndustrySuper };
};
