const { google } = require('googleapis');
require('dotenv').config();


const calendar = google.calendar({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY,
});

module.exports = calendar;