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
  const result = await run(data.whatToPlan, data.whenToPlan, data.currentSchedule);
  res.send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});


async function run(whatToPlan, whenToPlan, currentSchedule) {
  // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
  const prompt = `Jesteś ekspertem odnośnie zarządzania czasem oraz planowania zadań. Twoją specjalnością jest planowanie długoterminowe. Chcę nauczyć się ${whatToPlan} w ciągu ${whenToPlan}, a mój obecny plan to ${currentSchedule}. Rozpisz mi czynności, które mam wykonać lub tematy, które muszę opanować, aby zrealizować cel. Podziel je na drobne zadania, które będę sukcesywnie wykonywać. Skup się na planowaniu długoterminowym i porozkładaj zadania na różne dni. W description dodaj link do podanych przez ciebie tematów.`;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
const responseSchema ={
  "type": "object",
  "properties": {
    "day-number": {
      "type": "string"
    },
    "event": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "start-date": {
          "type": "string"
        },
        "end-date": {
          "type": "string"
        },
        "link": {
          "type": "string"
        },
      },
      "required": [
        "title",
        "description",
        "start-date",
        "end-date",
        "link"
      ]
    }
  },
  "required": [
    "day-number",
    "event"
  ]
}

  
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: prompt}],
      },
      {
        role: "model",
        parts: [{ text: "Let's plan something!" }],
      },
    ],
    generationConfig: {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 3000,
      responseMimeType: "application/json",
  responseSchema: responseSchema,
    },
  });

  const msg = prompt;

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  return text;
}

