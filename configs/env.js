require('dotenv').config();

module.exports = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
}