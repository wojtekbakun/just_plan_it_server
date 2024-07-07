// routes.js
const express = require("express");
const router = express.Router();
const oauth2Client = require("../configs/oauth2");

// generate a url that asks permissions for Google Calendar scope
const scopes = ["https://www.googleapis.com/auth/calendar.events"];

router.get("/google", async (req, res) => {
    if (req.session.tokens) {
        oauth2Client.setCredentials(req.session.tokens);
        res.send({ msg: "You are already connected to Google Calendar" });
    } else {
        const authUrl = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: "offline",

            // If you only need one scope, you can pass it as a string
            scope: scopes,
        });
        res.redirect(authUrl);
    }
});

router.get("/google/redirect", async (req, res) => {
    // Odczytujemy kod autoryzacyjny z req.query.code
    const code = req.query.code;
    console.log(req.query);

    // This will provide an object with the access_token and refresh_token.
    // Save these somewhere safe so they can be used at a later time.
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    req.session.tokens = tokens;

    res.send({ msg: "You are now connected to Google Calendar" });
});

module.exports = router;