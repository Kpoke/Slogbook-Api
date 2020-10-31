var mongoose = require("mongoose");

var ChatSchema = mongoose.Schema({
  report: String,
  date: Date,
  isReport: Boolean,
  industrySupervisorsComment: String,
  schoolSupervisorsComment: String,
  score: Number,
  imagePublicId: String,
  imageUrl: String,
});

module.exports = mongoose.model("Chat", ChatSchema);
