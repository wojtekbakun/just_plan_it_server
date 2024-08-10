const express = require("express");
const { getEventsFromFirebase } = require("../../services/firebase/managePlans");
const { ensureAuthenticated } = require('../../middleware/auth');
const router = express.Router();

router.get("/plans", ensureAuthenticated, async (req, res) => {
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


module.exports = router;