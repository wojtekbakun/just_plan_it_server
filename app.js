const express = require('express');
const app = express();
require('./configs/express')(app);

const { genAI, model } = require('./services/googleGemini');
const routes = require('./routes/routes');


app.use(routes);

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
  });



  const msg = prompt;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  console.log(text);
  return text;
}

