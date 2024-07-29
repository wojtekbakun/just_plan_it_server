const express = require("express");
const router = express.Router();
const generatePlan = require("../services/googleGemini");
const { uploadToFirebase, getEventsFromFirebase } = require("../services/googleFirebase");

router.post("/generatePlan", async (req, res) => {
    const data = req.body;
    const generatedPlan = await generatePlan(data.userInput);
    await uploadToFirebase(generatedPlan);
    res.send({ 'message': 'Plan successfully generated and uploaded to Firestore!' });
});

module.exports = router;