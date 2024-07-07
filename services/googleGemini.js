const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Access your API key as an environment variable 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = { genAI, model };