const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const { db } = require('../services/googleFirebase');

// Konfiguracja strategii Google
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            // Sprawdź, czy użytkownik już istnieje w Firestore
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('googleId', '==', profile.id).get();

            let user;
            if (snapshot.empty) {
                // Jeśli użytkownik nie istnieje, stwórz nowy dokument
                user = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    name: profile.name.givenName,
                    email: profile.emails[0].value,
                    createdAt: new Date().toISOString()
                };
                await usersRef.add(user);
            } else {
                // Jeśli użytkownik istnieje, pobierz jego dane
                snapshot.forEach(doc => {
                    user = doc.data();
                });
            }

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));

passport.use(new BearerStrategy(
    async (token, done) => {
        try {
            // Wykonaj zapytanie do Firestore, aby znaleźć użytkownika z danym tokenem
            const usersRef = db.collection('users');
            const snapshot = await usersRef.where('token', '==', token).limit(1).get();

            if (snapshot.empty) {
                return done(null, false);  // Brak użytkownika z tym tokenem
            }

            // Jeśli użytkownik zostanie znaleziony, zwróć go
            const userDoc = snapshot.docs[0];
            const user = userDoc.data();

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serializacja użytkownika do sesji
passport.serializeUser((user, done) => {
    done(null, user.googleId);
});

// Deserializacja użytkownika z sesji
passport.deserializeUser(async (id, done) => {
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('googleId', '==', id).get();

        let user;
        snapshot.forEach(doc => {
            user = doc.data();
        });

        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;