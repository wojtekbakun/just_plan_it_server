const express = require('express');
const passport = require('passport');

const router = express.Router();

// Route do inicjalizacji logowania przez Google
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }),
    (req, res) =>
        res.send('Logged in with Google')
);

// Callback route po zalogowaniu przez Google
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/', successRedirect: '/profile' }),
    (req, res) => {
        // Użytkownik zalogowany, można przekierować gdzieś dalej
        res.redirect('/profile');
    }
);

// Route to authenticate using Bearer token
router.get('/auth/bearer', passport.authenticate('bearer', { session: false }), (req, res) => {
    // If authentication is successful, the user information will be available in req.user
    res.json({ message: 'Authenticated', user: req.user });
});

// Route do wylogowania
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;