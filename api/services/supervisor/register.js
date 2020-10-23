const Admin = require("../../../models/admin");
const Supervisor = require("../../../models/supervisor");
const jwt = require("jsonwebtoken");

const { generateError } = require("../utilities");

module.exports = async (
  adminId,
  { name, username, password, frequency, email }
) => {
  let flag = await Supervisor.exists({ username });
  if (!flag) {
    let admin = await Admin.findById(adminId);
    if (!admin) {
      return generateError("User not Authorized to Perform this Action", 422);
    }
    let user = new Supervisor({ name, username, password, frequency, email });

    user.save();
    admin.supervisor.push(user._id);
    admin.save();

    jwt.sign({ userid: user._id }, process.env.SUPERVISORKEY);
    return { user };
  }

  return generateError("Supervisor Username already exists", 422);
};
