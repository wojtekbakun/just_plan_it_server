const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const env = require('./env');

// Konfiguracja strategii Google
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        // Tutaj można znaleźć lub stworzyć użytkownika w bazie danych
        // Użyj profile.id, profile.emails itp.
        const user = {
            googleId: profile.id,
            displayName: profile.displayName,
            emails: profile.emails
        };

        return done(null, user);
    }));

// Serializacja użytkownika do sesji
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserializacja użytkownika z sesji
passport.deserializeUser((user, done) => {
    done(null, user);
});