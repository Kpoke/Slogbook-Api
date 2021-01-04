const Admin = require("../../../models/admin");
const Supervisor = require("../../../models/supervisor");
const jwt = require("jsonwebtoken");

const { generateError } = require("../utilities");

module.exports = async (
  adminId,
  { name, username, password, frequency, email },
  populateObject
) => {
  let flag = await Supervisor.exists({ username });
  let flag2 = await Supervisor.exists({ email });
  if (flag2) {
    return generateError("Supervisor Email already exists", 422);
  }
  if (!flag) {
    let admin = await Admin.findById(adminId);
    if (!admin) {
      return generateError("User not Authorized to Perform this Action", 422);
    }
    let user = new Supervisor({ name, username, password, frequency, email });

    await user.save();
    admin.supervisor.push(user._id);
    await admin.save();

    jwt.sign({ userid: user._id }, process.env.SUPERVISORKEY);
    return { user: await Admin.findById(adminId).populate(populateObject) };
  }

  return generateError("Supervisor Username already exists", 422);
};
