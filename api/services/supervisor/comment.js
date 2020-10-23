const Chat = require("../../../models/chat");
const { generateError } = require("../utilities");

module.exports = async (update, filter) => {
  const message = await Chat.findOneAndUpdate(filter, update);
  if (!message) {
    return generateError("Comment Not Sent", 422);
  }
  return { report };
};
