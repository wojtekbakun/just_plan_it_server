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
  const result = await run(data.userInput);
  res.send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});


async function run(userInput) {

  const responseSchema = 
  {
  "type": "object",
  "properties": {
    "event-title": {
      "type": "string"
    },
    "event-description": {
      "type": "string"
    },
    "start-date": {
      "type": "string"
    },
    "end-date": {
      "type": "string"
    },
    "resource-link": {
      "type": "string"
    }
  },
  "required": [
    "event-title",
    "event-description",
    "start-date",
    "end-date",
    "resource-link"
  ]
}
  const prompt = `Jesteś ekspertem odnośnie zarządzania czasem oraz planowania zadań.
  Twoją specjalnością jest planowanie długoterminowe. Podam ci rzecz, którą chcę opanować i czas jaki chcę na to poświęcić,
  a ty na podstawie mojego planu rozpisz mi czynności, które mam wykonać lub tematy, które muszę opanować,
  aby zrealizować cel. Podziel je na drobne zadania, które będę sukcesywnie wykonywać.

  Chcę opanować: ${userInput}

  Twoja odpowiedź niech będzie w formacie JSON, zawierającym pola:
  events:
  - title: tytuł zadania
  - description: opis zadania
  - start-date: data rozpoczęcia zadania
  - end-date: data zakończenia zadania
  - resource-link: link do zasobu, który pomoże mi w realizacji zadania
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 3000,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    },
  } );
  


  const msg = prompt;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log(text);
  return text;
}

