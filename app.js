const passport = require('passport');
const session = require('./middleware/session');
const routes = require('./routes/routes');
const express = require('express');

const app = express();
require('./configs/express')(app);
const PORT = process.env.PORT || 3000;

app.use(session);

// Inicjalizacja Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Importowanie konfiguracji Passport.js
require('./configs/passport-config');

// konfiguracja routingu
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

module.exports = app;