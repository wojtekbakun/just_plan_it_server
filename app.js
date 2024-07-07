const express = require('express');
const app = express();
require('./configs/express')(app);

const routes = require('./routes/routes');

const PORT = process.env.PORT || 3000;

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});