const express = require("express"),
  router = express.Router();
const Campground = require("../models/campground"),
  middleware = require("../middleware");

router.get("/", async (req, res) => {
  try {
    let campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (error) {
    req.flash("error", "Campgrounds not found!");
    res.redirect("/");
  }
  // Campground.find({}, (err, campgrounds) => {
  //     if (err) {
  //         req.flash('error', 'Campgrounds not found!');
  //         console.log(err);
  //     } else {
  //         res.render("campgrounds/index", { campgrounds });
  //     }
  // });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, async (req, res) => {
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = {
    name: req.body.campground.name,
    price: req.body.campground.price,
    img: req.body.campground.image,
    description: req.body.campground.desc,
    author,
  };
  try {
    await Campground.create(newCampground);
    req.flash("success", "Campground added successfully");
    res.redirect("/campgrounds");
  } catch (error) {
    req.flash("error", "Error creating campground, try again");
    res.redirect("/campgrounds");
  }
  //   Campground.create(campground, (err, campground) => {
  //     if (err) {
  //       req.flash("error", "Error creating campground, try again");
  //       res.redirect("/campgrounds");
  //     } else {
  //       req.flash("success", "Campground added successfully");
  //       res.redirect("/campgrounds");
  //     }
  //   });
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, campground) => {
      if (err) {
        req.flash("error", "Campground not found!");
        res.redirect("back");
      } else {
        res.render("campgrounds/show", { campground });
      }
    });
});

// EDIT AND UPDATE ROUTE
// EDIT
router.get(
  "/:id/edit",
  middleware.checkCampgroundOwnership,
  async (req, res) => {
    let campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });

    //     Campground.findById(req.params.id, (err, campground) => {
    //         res.render("campgrounds/edit", { campground });
    //   });
  }
);
// update
router.put("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
  req.flash("success", "Campground edited successfully");
  res.redirect(`/campgrounds/${req.params.id}`);

  //   Campground.findByIdAndUpdate(
  //     req.params.id,
  //     req.body.campground,
  //     (err, campground) => {
  //       req.flash("success", "Campground edited successfully");
  //       res.redirect(`/campgrounds/${req.params.id}`);
  //     }
  //   );
});

// delete route
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
  await Campground.findByIdAndRemove(req.params.id);
  req.flash("success", "Campground deleted successfully");
  res.redirect("/campgrounds");

  //   Campground.findByIdAndRemove(req.params.id, (err) => {
  //     req.flash("success", "Campground deleted successfully");
  //     res.redirect("/campgrounds");
  //   });
});

module.exports = router;
