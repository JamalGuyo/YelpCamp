const mongoose = require("mongoose");

// schema
const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
});

module.exports = mongoose.model("Comment", commentSchema);
