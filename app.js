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


const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Jesteś ekspertem odnośnie zarządzania czasem oraz planowania zadań. Twoją specjalnością jest planowanie długoterminowe. Podam ci rzecz, którą będę chciał się nauczyć lub zadanie, które będę chciał wykonać oraz planowany czas, który chcę na to poświęcić. Podam ci także mój obecny rozkład obowiązków na dany okres, a ty rozpisz mi czynności, które mam wykonać lub tematy, które muszę opanować. Skup się na planowaniu długoterminowym i porozkładaj zadania na różne dni. W opisie dodaj link do podanych przez ciebie tematów. Podaj mi odpowiedź w formacie JSON z polami: tytuł, czas rozpoczęcia (data i godzina), czas zakończenia (data i godzina), opis (opis i link bez pola z opisem). " }],
      },
      {
        role: "model",
        parts: [{ text: "Let's plan something!" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const msg = prompt;

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}

