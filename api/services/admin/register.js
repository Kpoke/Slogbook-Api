const Admin = require("../../../models/admin");
const jwt = require("jsonwebtoken");

const { generateError } = require("../utilities");

module.exports = async ({ username, password }) => {
  if (!username || !password) {
    return generateError("Must provide Username and Password", 422);
  }
  let flag = await Admin.exists({ username });
  if (!flag) {
    const user = new Admin({ username, password });
    await user.save();
    const token = jwt.sign({ userid: user._id }, process.env.ADMINKEY);
    return { token };
  }

  return generateError("Username already exists", 422);
};
