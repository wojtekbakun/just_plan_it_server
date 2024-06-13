const http = require('http');
const url = require('url');
const express = require('express');
const app = express();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(" de: ", process.env.GEMINI_API_KEY);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

app.use(express.json());

// Middleware do parsowania danych formularza
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome in Calend.ai!!');
});

// app.get('/generate', async (req, res) => {
//   const data = req.data;
//   const prompt = req.query.prompt;
//   const result = await run(prompt);
//   res.send(result);
// });

app.post('/generate', async (req, res) => {
  const data = req.body;
  const result = await run(data.prompt);
  res.send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

async function run(prompt) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}

