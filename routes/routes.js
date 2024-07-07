const express = require("express");
const router = express.Router();

const geminiRoutes = require("./googleGemini");
const calendarRoutes = require("./googleCalendar");
const oauth2Routes = require("./oauth2");

router.use(geminiRoutes);
router.use(calendarRoutes);
router.use(oauth2Routes);

router.get("/", (req, res) => {
    res.send("Welcome in Calend.ai!!");
});

// Eksportuj router
module.exports = router;
