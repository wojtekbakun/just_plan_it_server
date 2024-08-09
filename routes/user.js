const express = require("express");
const { addUser } = require("../services/user");
const ensureAuthenticated = require("../middleware/auth");
const router = express.Router();

router.post("/user", ensureAuthenticated, async (req, res) => {
    const { displayName, email, googleId } = req.body;

    try {
        addUser(displayName, email, googleId);
        res.status(201).json({ response: "User added" });
    } catch (err) {
        res.status(500).send("An error occurred: " + err);
    }

});

module.exports = router;