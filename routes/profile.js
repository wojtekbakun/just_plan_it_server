const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');
const { addUser } = require('../services/user');
const passport = require('passport');

// Route do wyświetlania profilu użytkownika (przykład)
router.get('/profile', ensureAuthenticated, (req, res) => {
    const displayName = req.user.displayName;
    const googleId = req.user.googleId;
    const email = req.user.email;
    res.send(`Hello ${req.user.displayName}, your id is ${req.user.googleId}, name is ${req.user.name} and you are logged in!`);
});

// Route do wyświetlania profilu użytkownika (przykład)
router.get('/profile2', passport.authenticate('bearer', { session: false }), (req, res) => {
    const displayName = req.user.displayName;
    const googleId = req.user.googleId;
    const email = req.user.email;
    res.send(`Hello ${req.user.displayName}, your id is ${req.user.googleId}, name is ${req.user.name} and you are logged in!`);
});

module.exports = router;