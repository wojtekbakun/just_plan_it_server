const http = require('http');
const url = require('url');

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log(" de: ", process.env.GEMINI_API_KEY);

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  // Endpoint główny
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Witaj na głównej stronie!');
  }
  // Customowy endpoint "/hello"
  else if (pathname === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Witaj świecie!');
  }
  // Customowy endpoint z parametrem "/user/:name"
  else if (pathname.startsWith('/user/')) {
    const name = pathname.split('/')[2];
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Witaj, ${name}!`);
  }
  // Endpoint obsługujący żądania POST na "/data"
  else if (pathname === '/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const data = JSON.parse(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(`Otrzymano dane: ${JSON.stringify(data)}`);
    });
  }
  // Endpoint nie znaleziony
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Strona nie znaleziona');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});

async function run() {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = "Write me 5 random words"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();