const express = require('express'),
    router = express.Router();
const Campground = require('../models/campground'),
    middleware = require('../middleware');

router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            req.flash('error', 'Campgrounds not found!');
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds });
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
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
            req.flash('error', 'Error creating campground, try again');
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Campground added successfully');
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
                req.flash('error', 'Campground not found!');
                res.redirect('back');
            } else {
                res.render("campgrounds/show", { campground });
            }
        });
});

// EDIT AND UPDATE ROUTE
// EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render('campgrounds/edit', { campground });
    });
});
// update
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        req.flash('success', 'Campground edited successfully');
        res.redirect(`/campgrounds/${req.params.id}`);
    });
});

// delete route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        req.flash('success', 'Campground deleted successfully');
        res.redirect('/campgrounds');
    });
});

module.exports = router;