const admin = require('firebase-admin');
const serviceAccount = require('../firebase_key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://justplanit-ebff7-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

module.exports = { admin, db }