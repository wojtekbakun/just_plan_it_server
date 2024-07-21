const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function generatePlan(userInput) {
    // Access your API key as an environment variable 
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const prompt =
        `
        You are an expert in time management and task planning. Your specialty is long-term planning.
        I will provide you with a skill I want to master and the time I want to dedicate to it.
        Based on my plan, you will outline tasks and topics for me to master.
        Divide them into small tasks that I will complete gradually.
        Today is ${Date.now}.

        Focus on:

        - Providing a realistic timeframe for completing a given task (2 hours max but should be less than 1 hour).
        - Prioritizing tasks based on their importance and deadline.
        - Spreading tasks over a longer period (e.g., several months), considering time for rest and unforeseen circumstances.
        - Suggesting optimal deadlines for future tasks to be realistic and achievable.
        - Adjusting the plan in case of changing priorities or new tasks.

        I want to master: ${userInput}

        Your response should be in JSON format, containing the fields:

        eventName: event title (max 3 words)
        events:
            taskNumber: task number
            title: task title
            description: task description
            startDate: task start date and time (ISO format)
            endDate: task end date and time (ISO format)
            timeZone: task time zone
            resourceLink: link to a resource that will help me complete the task
            resourceLinkTitle: title of the resource
    `;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash", generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 3000,
            responseMimeType: "application/json",
        },
    });



    //const msg = prompt;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log(text);
    return text;
}

module.exports = generatePlan;