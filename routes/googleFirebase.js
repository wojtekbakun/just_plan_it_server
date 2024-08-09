const express = require("express");
const { getEventsFromFirebase, getUserEmail } = require("../services/googleFirebase");
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.get("/plans", async (req, res) => {
    //  const { startDate } = req.body;
    const { googleId } = req.user.googleId;

    getEventsFromFirebase(startDate)
        .then((events) => {
            res.send(events);
        })
        .catch((err) => {
            res.status(500).send("An error occurred: " + err);
        });
});

router.get("/plansy", ensureAuthenticated, async (req, res) => {
    const googleId = req.user.googleId;

    console.log(googleId);

    getUserEmail(googleId).then((email) => {
        res.send(email);
    }).catch((err) => {
        res.status(500).send("An error occurred: " + err);
    });
});

module.exports = router;