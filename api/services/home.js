const { generateError, getModel } = require("./utilities");

module.exports = async (id, populateObject, key) => {
  const Model = getModel(key);
  if (!Model) throw new Error("illegal Key");

  const user = await Model.findById(id).populate(populateObject);
  if (!user) {
    return generateError("Account Not Found", 422);
  }
  if (user.student) {
    let total = 0;
    user.student.forEach(async (student) => {
      reports = student.message;
      reports.forEach((entry) => {
        if (entry.isReport && entry.score) {
          total += entry.score;
        }
      });
      student.score = total;
      await student.save();
    });
  }
  return { user };
};
