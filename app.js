const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// mongoose setup
mongoose
  .connect("mongodb://localhost/yelpcamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Yelcamp db connected`))
  .catch((err) => console.log(`can't connect to db ${err}`));

// campgrounds schema
const campgroundSchema = new mongoose.Schema({
  name: String,
  img: String,
  description: String,
});

const Campground = mongoose.model("Campground", campgroundSchema);

// setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

/*
const campgrounds = [
  {
    name: "Mountain Goat's rest",
    img:
      "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Salmon Creek",
    img:
      "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Granite Hill",
    img:
      "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  },
];
*/

// routes
app.get("/", (req, res) => {
  res.render("landing");
});

// INDEX ROUTE
app.get("/campgrounds", (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds });
    }
  });
});

// NEW ROUTE
app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

// CREATE ROUTE
app.post("/campgrounds", (req, res) => {
  const name = req.body.name;
  const img = req.body.image;
  const description = req.body.desc;
  Campground.create(
    {
      name,
      img,
      description,
    },
    (err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    }
  );
});

// SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { campground });
    }
  });
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`YelpCamp server started on port ${port}...`)
);
