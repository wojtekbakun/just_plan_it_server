const express = require("express");
const router = express.Router();

const geminiRoutes = require("./gemini/googleGemini");
//const calendarRoutes = require("./googleCalendar");
//const oauth2Routes = require("./oauth2");
const firebaseRoutes = require("./firebase/googleFirebase");
const authRoutes = require("./auth/auth");

router.use(geminiRoutes);
//router.use(calendarRoutes);
//router.use(oauth2Routes);
router.use(firebaseRoutes);
router.use(authRoutes);

router.get("/", (req, res) => {
    res.send('Hello! Please <a href="/auth/google">log in with Google</a>.');
});

// Eksportuj router
module.exports = router;
