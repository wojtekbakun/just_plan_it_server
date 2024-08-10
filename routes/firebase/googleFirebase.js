const express = require("express");
const { getEventsFromFirebase } = require("../../services/firebase/managePlans");
const { ensureAuthenticated } = require('../../middleware/auth');
const router = express.Router();

router.get("/plans", ensureAuthenticated, async (req, res) => {
    const googleId = req.user.googleId;
    console.log('googleId:', googleId);
    getEventsFromFirebase(googleId)
        .then((events) => {
            res.send(events);
        })
        .catch((err) => {
            res.status(500).send("An error occurred: " + err);
        });
});

router.get("/plans/:planId", ensureAuthenticated, async (req, res) => {
    const googleId = req.user.googleId;
    //const { planId } = req.params;
    const planId = 'Mastering Apple Pie Baking';

    console.log('googleId:', googleId);
    console.log('planId:', planId);

    getEventsFromFirebase(googleId, planId)
    // .then((events) => {
    //     res.send(events);
    // })
    // .catch((err) => {
    //     res.status(500).send("An error occurred: " + err);
    // });
});

module.exports = router;