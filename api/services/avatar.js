const path = require("path");
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

const cloudinary = require("./cloudinary.config");
const { generateError, getModel } = require("./utilities");

module.exports = async (id, key, multerImage) => {
  const { Model, populateObject } = getModel(key, true);
  if (!Model) throw new Error("illegal Key");

  const user = await Model.findById(id).populate(populateObject);
  if (!user) {
    return generateError("Account Not Found", 422);
  }

  parser.format(
    path.extname(multerImage.originalname).toString(),
    multerImage.buffer
  );

  const image = await cloudinary.uploader.upload(parser.content, {
    public_id: `${user.username}/avatar`,
    tags: user.username,
  });

  if (!image) {
    return generateError("An Error Occurred, Try Again", 500);
  }
  user["avatarPublicId"] = image.public_id;
  user["avatarUrl"] = image.url;

  await user.save();

  return { user };
};
