const mongoose = require("mongoose");
const campgroundSchema = new mongoose.Schema({
  name: String,
  img: String,
  description: String,
});

module.exports = mongoose.model("Campground", campgroundSchema);
