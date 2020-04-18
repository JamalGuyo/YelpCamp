const mongoose = require("mongoose");
const campgroundSchema = new mongoose.Schema({
  name: String,
  price: Number,
  img: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Campground", campgroundSchema);
