const express = require("express");
const router = express.Router();

const geminiRoutes = require("./googleGemini");
//const calendarRoutes = require("./googleCalendar");
//const oauth2Routes = require("./oauth2");
const firebaseRoutes = require("./googleFirebase");
const userRoutes = require("./user");
const authRoutes = require("./auth");
const profileRoutes = require("./profile");

router.use(geminiRoutes);
//router.use(calendarRoutes);
//router.use(oauth2Routes);
router.use(firebaseRoutes);
router.use(userRoutes);
router.use(authRoutes);
router.use(profileRoutes);

router.get("/", (req, res) => {
    res.send('Hello! Please <a href="/auth/google">log in with Google</a>.');
});

// Eksportuj router
module.exports = router;
