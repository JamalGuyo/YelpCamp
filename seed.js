const mongoose = require("mongoose"),
  Campground = require("./models/campground");
Comment = require("./models/comment");

const seeds = [
  {
    name: "Cloud's Rest",
    img: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  },
  {
    name: "Desert Mesa",
    img: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  },
  {
    name: "Canyon Floor",
    img: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  },
];

async function seedDB() {
  //remove comments
  await Comment.deleteMany({});
  console.log("comments removed");
  // remove all campgrounds
  await Campground.deleteMany({});
  console.log(`removed all campgrounds!`);
  // add a few campgrounds
  for (const seed of seeds) {
    let campground = await Campground.create(seed);
    console.log(`Created new campground!`);
    // add a comment
    let comment = await Comment.create({
      text: "This is place is great",
      author: "Jane Doe",
    });
    campground.comments.push(comment);
    campground.save();
    console.log(`Create a new comment!`);
  }
}

module.exports = seedDB;
