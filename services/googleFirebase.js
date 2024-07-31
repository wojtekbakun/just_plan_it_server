const admin = require('firebase-admin');
const serviceAccount = require('../firebase_key.json');

const userId = 'user123';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

uploadToFirebase = (events) => {
    const db = admin.firestore();
    const obj = JSON.parse(events);
    const eventName = obj.eventName;
    console.log('Event name: ', eventName);
    sendAllToFirebase('events', obj.events, eventName, db);
};


async function sendAllToFirebase(collectionName, eventToSend, eventName, db) {

    const eventsRef = db.collection('users').doc(userId).collection('plans');

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
    const eventDocRef = db.collection('users').doc(userId).collection('plans').doc(eventName);
    await eventDocRef.set({
        steps: {
            title: eventToSend.title,
            taskNumber: eventToSend.taskNumber,
            description: eventToSend.description,
            resourceLink: eventToSend.resourceLink,
            resourceLinkTitle: eventToSend.resourceLinkTitle,
            startDate: eventToSend.startDate,
            endDate: eventToSend.endDate,
        },
        createdAt: new Date().toISOString(),
    })
        .then(eventDocRef => {
            resolve(eventDocRef);
            console.log(`Step ${docTitle}`);
        })
        .catch(error => {
            reject(error);
            console.error(`There is an error: ${error}`);
        });
}

async function getEventsFromFirebase(startDate) {
    const db = admin.firestore();
    const eventsRef = db.collection('events/' + 'Mastering Babka Baking' + '/steps');
    const snapshot = await eventsRef.get();
    const eventsOfTheDay = [];

    const start = new Date(startDate);
    const dayToCheck = start.getUTCDate();

    try {
        snapshot.forEach(doc => {
            const docStartDate = new Date(doc.data().startDate).getUTCDate();
            if (docStartDate === dayToCheck) {
                eventsOfTheDay.push(doc.data());
            }
        });
    }
    catch (error) {
        console.error('Error getting documents', error);
    }
    return eventsOfTheDay;
}

module.exports = { uploadToFirebase, getEventsFromFirebase }; 