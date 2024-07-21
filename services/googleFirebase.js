const admin = require('firebase-admin');
const serviceAccount = require('../firebase_key.json');
const { resource } = require('../app');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

uploadToFirebase = (events) => {
    const db = admin.firestore();
    const obj = JSON.parse(events);
    const eventName = obj.eventName;
    sendAllToFirebase('events', obj.events, eventName, db);
};


async function sendAllToFirebase(collectionName, eventToSend, eventName, db) {
    //first send username
    const eventsRef = db.collection(collectionName).doc(eventName);
    await eventsRef.set({
        createdAt: new Date().toISOString(),
    }).then(() => {
        console.log('Username added');
    }).catch((err) => {
        console.error('An error occurred: ', err);
    });

    //then send all events
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
        description: eventToSend.description,
        resourceLink: eventToSend.resourceLink,
        resourceLinkTitle: eventToSend.resourceLinkTitle,
        startDate: eventToSend.startDate,
        endDate: eventToSend.endDate,
        timeZone: eventToSend.timeZone,
        createdAt: new Date().toISOString(),
    })
        .then(eventDocRef => {
            resolve(eventDocRef);
            console.log(`Added event ${docTitle}`);
        })
        .catch(error => {
            reject(error);
            console.error(`There is an error: ${error}`);
        });
}

module.exports = uploadToFirebase; 