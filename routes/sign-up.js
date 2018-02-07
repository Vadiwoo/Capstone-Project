const express = require('express');
const router = express.Router();
const passport = require('passport');

const Organization = require('../models/organization');
const User = require('../models/user');


router.get('/', (req, res) => {
    res.render('sign-up');
});

router.post('/', (req, res, next) => {
    const { username, password, confirmPassword, role } = req.body;

    if (password !== confirmPassword) {
        return next(new Error('Passwords do not match'));
    }

    User.register(new User({
        username,
        role
    }), password, err => {
        if (err) {
            return next(err);
        }

        passport.authenticate('local')(req, res, () => res.redirect('/'));
    });
});

module.exports = router;