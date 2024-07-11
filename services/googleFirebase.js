const admin = require('firebase-admin');
const serviceAccount = require('../firebase_key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

uploadToFirebase = (events) => {
    const db = admin.firestore();
    const obj = JSON.parse(events);
    const eventName = obj.eventName;
    sendAllToFirebase('events', obj.events, eventName, db);
};


function sendAllToFirebase(collectionName, eventToSend, eventName, db) {
    const allPromises = eventToSend.map((singleEvent) => {
        return new Promise((resolve, reject) => {
            sendSingleEventToFirebase(singleEvent, collectionName, eventName, db, resolve, reject);
        });
    });

    Promise.all(allPromises)
        .then(() => {
            console.log('All events created');
        })
        .catch((err) => {
            console.error('An error occurred: ', err);
        });
};

async function sendSingleEventToFirebase(eventToSend, collectionName, eventName, db, resolve, reject) {
    const docTitle = eventToSend.taskNumber + '. ' + eventToSend.title;
    const eventDocRef = db.collection(collectionName).doc(eventName).collection('steps').doc(docTitle);
    await eventDocRef.set({
        taskNumber: eventToSend.taskNumber,
        title: eventToSend.title,
        description: eventToSend.description + '\n\n' + eventName,
        startDate: eventToSend.startDate,
        endDate: eventToSend.endDate,
        timeZone: eventToSend.timeZone,
    })
        .then(eventDocRef => {
            resolve(eventDocRef);
            console.log(`Dodano event o tytule: ${docTitle}`);
        })
        .catch(error => {
            reject(error);
            console.error(`Wystąpił błąd przy dodawaniu eventu: ${error}`);
        });
}

module.exports = uploadToFirebase; 