const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
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

// AUth setup
app.use(require("express-session")({
  secret: 'js is an awesome programming language',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
      res.render("campgrounds/index", { campgrounds });
    }
  });
});

// NEW ROUTE
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// CREATE ROUTE
app.post("/campgrounds", (req, res) => {
  Campground.create(req.body.campground, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, campground) => {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground });
      }
    });
});

// COMMENT ROUTES
// COMMENT -> NEW ROUTE
app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.render("comments/new", { campground });
    }
  });
});

// COMMENT -> CREATE ROUTE
app.post("/campgrounds/:id/comments", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campground._id}`);
        }
      });
    }
  });
});

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`YelpCamp server started on port ${port}...`)
);
