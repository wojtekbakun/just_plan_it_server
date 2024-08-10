const express = require("express");
const router = express.Router();
const generatePlan = require("../../services/gemini/googleGemini");
const { ensureAuthenticated } = require("../../middleware/auth");
const { uploadToFirebase } = require("../../services/firebase/uploadEvent");

router.post("/generatePlan", ensureAuthenticated, async (req, res) => {
    const userId = req.user.googleId;
    const data = req.body;
    const generatedPlan = await generatePlan(data.userInput);
    await uploadToFirebase(userId, generatedPlan);
    res.send({ 'message': 'Plan successfully generated and uploaded to Firestore!' });
});

module.exports = router;