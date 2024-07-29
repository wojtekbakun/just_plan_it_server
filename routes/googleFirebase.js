const express = require("express");
const { getEventsFromFirebase } = require("../services/googleFirebase");
const router = express.Router();

router.get("/plans", async (req, res) => {
    const { startDate } = req.body;
    getEventsFromFirebase(startDate)
        .then((events) => {
            res.send(events);
        })
        .catch((err) => {
            res.status(500).send("An error occurred: " + err);
        });
});

module.exports = router;