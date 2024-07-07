const session = require('express-session');

module.exports = session({
  secret: 'xxxx', // użyj długiego, losowego ciągu znaków w produkcji
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // ustaw na `true` jeśli używasz https
});