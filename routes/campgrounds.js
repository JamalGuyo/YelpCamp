const express = require('express'),
    router = express.Router();
const Campground = require('../models/campground');

router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds });
        }
    });
});

// NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// CREATE ROUTE
router.post("/", isLoggedIn, (req, res) => {
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const campground = {
        name: req.body.campground.name,
        img: req.body.campground.image,
        description: req.body.campground.desc,
        author
    }
    Campground.create(campground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
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

// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;