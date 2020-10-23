const { generateError, getModel } = require("./utilities");

module.exports = async (id, populateObject, key) => {
  const Model = getModel(key);
  if (!Model) throw new Error("illegal Key");

  const user = await Model.findById(id).populate(populateObject);
  if (!user) {
    return generateError("Account Not Found", 422);
  }
  return { user };
};
