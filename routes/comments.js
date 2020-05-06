const express = require("express"),
  router = express.Router({ mergeParams: true });
const Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, async (req, res) => {
  try {
    let campground = await Campground.findById(req.params.id);
    res.render("comments/new", { campground });
  } catch (error) {
    req.flash("error", "Campground not found!");
    res.redirect("back");
  }
  //   Campground.findById(req.params.id, (err, campground) => {
  //     if (err) {
  //       req.flash("error", "Campground not found!");
  //       res.redirect("back");
  //     } else {
  //       res.render("comments/new", { campground });
  //     }
  //   });
});

// COMMENT -> CREATE ROUTE
router.post("/", middleware.isLoggedIn, async (req, res) => {
  try {
    let campground = await Campground.findById(req.params.id);
    try {
      let comment = await Comment.create(req.body.comment);
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.save();
      campground.comments.push(comment);
      campground.save();
      req.flash("success", "Comment added successfully");
      res.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
      req.flash("error", "Failed to comment, try again!");
      res.redirect("back");
    }
  } catch (error) {
    req.flash("error", "campground not found!");
    res.redirect("back");
  }

  //   Campground.findById(req.params.id, (err, campground) => {
  //     if (err) {
  //       req.flash("error", "campground not found!");
  //       res.redirect("back");
  //     } else {
  //       Comment.create(req.body.comment, (err, comment) => {
  //         if (err) {
  //           req.flash("error", "Failed to comment, try again!");
  //           res.redirect("back");
  //         } else {
  //           comment.author.id = req.user._id;
  //           comment.author.username = req.user.username;
  //           comment.save();
  //           campground.comments.push(comment);
  //           campground.save();
  //           req.flash("success", "Comment added successfully");
  //           res.redirect(`/campgrounds/${campground._id}`);
  //         }
  //       });
  //     }
  //   });
});

// EDITUPDATE ROUTE
//EDIT
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  async (req, res) => {
    let comment = await Comment.findById(req.params.comment_id);
    res.render("comments/edit", { comment, campgroundId: req.params.id });

    // Comment.findById(req.params.comment_id, (err, comment) => {
    //   res.render("comments/edit", { comment, campgroundId: req.params.id });
    // });
  }
);

// UPDATE
router.put(
  "/:comment_id",
  middleware.checkCommentOwnership,
  async (req, res) => {
    await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
    res.redirect(`/campgrounds/${req.params.id}`);

    // Comment.findByIdAndUpdate(
    //   req.params.comment_id,
    //   req.body.comment,
    //   (err, comment) => {
    //     res.redirect(`/campgrounds/${req.params.id}`);
    //   }
    // );
  }
);

// DELETE
router.delete(
  "/:comment_id",
  middleware.checkCommentOwnership,
  async (req, res) => {
    await Comment.findByIdAndRemove(req.params.comment_id);
    res.redirect(`/campgrounds/${req.params.id}`);

    //   Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
    //     res.redirect(`/campgrounds/${req.params.id}`);
    //   });
  }
);

module.exports = router;
