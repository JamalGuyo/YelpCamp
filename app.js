const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  seedDb = require("./seed");

// mongoose setup
mongoose
  .connect("mongodb://localhost/yelpcamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Yelcamp db connected`))
  .catch((err) => console.log(`can't connect to db ${err}`));

// setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
// run seedDB
seedDb();

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
