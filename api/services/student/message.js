const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const cloudinary = require("../cloudinary.config");

const Student = require("../../../models/student");
const Chat = require("../../../models/chat");
const { generateError } = require("../utilities");
const path = require("path");

module.exports = async (studentId, formData, multerImage) => {
  let student = await Student.findById(studentId).populate("message");
  if (!student) {
    return generateError("User does not exists", 422);
  }
  let message = {
    report: formData.report,
    isReport: formData.isReport,
    date: formData.date,
  };
  if (formData.isReport) {
    parser.format(
      path.extname(multerImage.originalname).toString(),
      multerImage.buffer
    );

    const uniqueFilename = new Date().toISOString();
    const image = await cloudinary.uploader.upload(parser.content, {
      public_id: `${student.matricNumber}/${uniqueFilename}`,
      tags: student.matricNumber,
    });

    if (!image) {
      return generateError("An Error Occurred, Try Again", 500);
    }
    message["imagePublicId"] = image.public_id;
    message["imageUrl"] = image.url;
  }

  let newMessage = new Chat(message);
  await newMessage.save();
  student.message.push(newMessage._id);
  await student.save();

  return { message: newMessage };
};
