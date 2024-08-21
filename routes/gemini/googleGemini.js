const express = require("express");
const router = express.Router();
const generatePlan = require("../../services/gemini/googleGemini");
const { ensureAuthenticated } = require("../../middleware/auth");
const { uploadToFirebase } = require("../../services/firebase/uploadEvent");

router.post("/generate-plan", ensureAuthenticated, async (req, res) => {
    const userId = req.user.googleId;
    const data = req.body;
    const generatedPlan = await generatePlan(data.userInput);
    await uploadToFirebase(userId, generatedPlan).then((response) => {
        res.status(201).json({ response: 'Plan successfully uploaded to Firestore!' });
        console.log('Plan successfully uploaded to Firestore!');
    }).catch((err) => {
        res.status(500);
        console.error(err);
    });
});

module.exports = router;