const express = require("express");
const { getEventsFromFirebase, getAllEventsForUser } = require("../../services/firebase/managePlans");
const { ensureAuthenticated } = require('../../middleware/auth');
const router = express.Router();

router.get("/plans", ensureAuthenticated, async (req, res) => {
    const googleId = req.user.googleId;

    getAllEventsForUser(googleId)
        .then((response) => {
            res.status(response.status).send(response.events);
        })
        .catch((err) => {
            res.status(500).send("An error occurred: " + err);
        });
});

router.get("/plans/:planId", ensureAuthenticated, async (req, res) => {
    const googleId = req.user.googleId;
    const { planId } = req.params;

    getEventsFromFirebase(googleId, planId)
        .then((response) => {
            if (response.events === null) {
                console.log("No such document!");
                res.status(response.status).send("No such document!");
            }
            else {
                res.status(response.status).json(response.events);
            }
        })
        .catch((err) => {
            res.status(500).send("An error occurred: " + err);
        });
});

module.exports = router;