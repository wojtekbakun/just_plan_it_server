const http = require('http');
const url = require('url');
require('dotenv').config();
const express = require('express');
const app = express();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const e = require('express');

const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

// generate a url that asks permissions for Google Calendar scope
const scopes = [
  'https://www.googleapis.com/auth/calendar.events'
];

const calendar = google.calendar({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

// async function sendEvent() {
//   const event = {
//     'summary': "eventData.summary",
//     'description': "eventData.description",
//     'start': {
//       'dateTime': "2024-07-07T09:00:00-02:00",
//       'timeZone': 'Europe/Warsaw',
//     },
//     'end': {
//       'dateTime': "2024-07-07T09:30:00-02:00",
//       'timeZone': 'Europe/Warsaw',
//     },
//   }

//   calendarz.events.insert({
//   auth: auth,
//   calendarId: 'primary',
//   resource: event,
// }, function(err, event) {
//   if (err) {
//     console.log('There was an error contacting the Calendar service: ' + err);
//     return;
//   }
//  console.log('Event created: %s', event.link);
//    });
// }


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

app.get('/google', async (req, res) => {
  // Odczytujemy tablicę eventów z req.body.events

  //const events = req.body.events;

  // // Przechodzimy przez każdy event i wysyłamy go do kalendarza
  // for (const eventData of events) {
  //   // Zmieniamy nazwy kluczy na te oczekiwane przez sendEvent
  //   await sendEvent(authorize(), eventData);
  // }

  const authUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope, you can pass it as a string
  scope: scopes
});
  res.redirect(authUrl);
});

//ZA KAZDYM RAZEM JEST INNY TOKEN ?!?

app.get('/google/redirect', async (req, res) => {
  // Odczytujemy kod autoryzacyjny z req.query.code
  const code = req.query.code;
  console.log(req.query);
  
  // This will provide an object with the access_token and refresh_token.
  // Save these somewhere safe so they can be used at a later time.
  const {tokens} = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);
  
  res.send('You are now connected to Google Calendar');
});

app.post('/send-event', async (req, res) => {

  summary = req.body["title"];
  description = req.body["description"];

  

const event = {
  'summary': `title:${summary}`,
  'description': description,
  'start': {
    'dateTime': '2024-07-07T09:00:00-07:00',
    'timeZone': 'America/Los_Angeles',
  },
  'end': {
    'dateTime': '2024-07-07T17:00:00-07:00',
    'timeZone': 'America/Los_Angeles',
  },
};

calendar.events.insert({
  auth: oauth2Client,
  calendarId: 'primary',
  resource: event,
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  res.send('Event created');
  console.log('Event created: %s', event.htmlLink);
});
});

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

  const prompt = `
  You are an expert in time management and task planning. Your specialty is long-term planning.
  I will provide you with a skill I want to master and the time I want to dedicate to it.
  Based on my plan, you will outline tasks and topics for me to master.
  Divide them into small tasks that I will complete gradually.
  Today is 06.07.2024.

Focus on:

  - Providing a realistic timeframe for completing a given task (2 hours max but should be less than 1 hour).
  -	Prioritizing tasks based on their importance and deadline.
	-	Spreading tasks over a longer period (e.g., several months), considering time for rest and unforeseen circumstances.
	-	Suggesting optimal deadlines for future tasks to be realistic and achievable.
	-	Adjusting the plan in case of changing priorities or new tasks.

I want to master: ${userInput}

Your response should be in JSON format, containing the fields:

	events:
	•	title: task title
	•	description: task description
	•	startDate: task start date and time (YYYY-MM-DDTHH:mm:ssZ)
	•	endDate: task end date and time (YYYY-MM-DDTHH:mm:ssZ)
	•	resourceLink: link to a resource that will help me complete the task
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

