const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  User = require('./models/user'),
  methodOverride = require('method-override'),
  seedDb = require("./seed");

// modules 
const indexRoute = require('./routes/index'),
  campgroundRoute = require('./routes/campgrounds'),
  commentRoute = require('./routes/comments');

// mongoose setup
mongoose
  .connect("mongodb://localhost/yelpcamp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log(`Yelcamp db connected`))
  .catch((err) => console.log(`can't connect to db ${err}`));

// setup
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// run seedDB
// seedDb();

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
// custom middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})

// routes
app.use(indexRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments", commentRoute);

// listener
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`YelpCamp server started on port ${port}...`)
);
