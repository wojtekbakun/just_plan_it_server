const express = require('express');
const passport = require('passport');

const router = express.Router();

// Route do inicjalizacji logowania przez Google
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route po zalogowaniu przez Google
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/', successRedirect: '/profile' }),
    (req, res) => {
        // Użytkownik zalogowany, można przekierować gdzieś dalej
        res.redirect('/profile');
    }
);

// Route do wylogowania
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;