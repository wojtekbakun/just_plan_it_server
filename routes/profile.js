const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/auth');

// Route do wyświetlania profilu użytkownika (przykład)
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.send(`Hello ${req.user.displayName}, your id is ${req.user.id}`);
});

module.exports = router;