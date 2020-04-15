const express = require('express'),
    router = express.Router();

const User = require('../models/user');
const passport = require('passport');
// index routes
router.get("/", (req, res) => {
    res.render("landing");
});
// REGISTER
router.get('/register', (req, res) => {
    res.render('register');
})

router.post('/register', (req, res) => {
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds')
        })
    })
});

// LOGIN
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
});
// logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login')
})


// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;