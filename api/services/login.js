const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { generateError, getModel } = require("./utilities");

module.exports = async ({ username, password }, key, populateObject) => {
  const Model = getModel(key);
  if (!Model) throw new Error("illegal Key");
  if (!username || !password)
    return generateError("Must provide Username and Password", 422);
  let user = await Model.findOne({ username }).populate(populateObject);
  if (!user) {
    return generateError("Invalid Username and Password Combination", 422);
  }
  let flag = await bcrypt.compare(password, user.password);
  if (!flag) {
    return generateError("Invalid Username and Password Combination", 422);
  }
  const token = jwt.sign({ userid: user._id }, key);
  return { token, user };
};
