const admin = require('firebase-admin');
const serviceAccount = require('../firebase_key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

uploadToFirebase = (events) => {
    const db = admin.firestore();
    const obj = JSON.parse(events);
    sendAllToFirebase(obj.events, 'events', db);
};


function sendAllToFirebase(eventToSend, collectionName, db) {
    const allPromises = eventToSend.map((singleEvent) => {
        return new Promise((resolve, reject) => {
            sendSingleEventToFirebase(singleEvent, collectionName, db, resolve, reject);
        });
    });

    Promise.all(allPromises)
        .then(() => {
            console.log('All events created');
        })
        .catch((err) => {
            console.error('An error occurred');
        });
};

function sendSingleEventToFirebase(eventToSend, collectionName, db, resolve, reject) {
    db.collection(collectionName).add({
        title: eventToSend.title,
        description: eventToSend.description,
        startDate: eventToSend.startDate,
        endDate: eventToSend.endDate,
        timeZone: eventToSend.timeZone,
    })
        .then(docRef => {
            resolve(docRef);
            console.log(`Event dodany z ID: ${docRef.id}`);
        })
        .catch(error => {
            reject(error);
            console.error(`Wystąpił błąd przy dodawaniu eventu: ${error}`);
        });
}

module.exports = uploadToFirebase; 