const express = require("express");
const router = express.Router();


router.post("/generate", async (req, res) => {
    const data = req.body;
    const result = await run(data.userInput);
    res.send(result);
});

module.exports = router;