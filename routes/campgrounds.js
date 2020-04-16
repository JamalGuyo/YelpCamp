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

// EDIT AND UPDATE ROUTE
// EDIT
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/edit', { campground });
        }
    })
});
// update
router.put('/:id', (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds')
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
})

// delete route
router.delete('/:id', (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds')
        }
    })
})


// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;