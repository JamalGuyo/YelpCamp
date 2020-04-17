const Campground = require('../models/campground'),
    Comment = require('../models/comment');

let middleware = {};

middleware.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                req.flash('error', 'Campground not found!');
                res.redirect('back');
            } else {
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You don\'t have the permission to do that');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middleware.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                req.flash('error', 'Comment not found!');
                res.redirect('back');
            } else {
                if (comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You don\'t have the permission to do that');
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middleware.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('/login');
    }
}


module.exports = middleware;