const express = require("express");
const { addUser } = require("../services/user");
const router = express.Router();

router.post("/user", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email) {
        return res.status(400).send('Name and email are required');
    }

    if (!password) {
        return res.status(400).send('Password is required');
    }

    try {
        addUser(name, email, password);
        res.status(201).json({ msg: "User added" });
    } catch (err) {
        res.status(500).send("An error occurred: " + err);
    }

});

module.exports = router;