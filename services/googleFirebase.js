const admin = require('firebase-admin');
const serviceAccount = require('../firebase_key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://justplanit-ebff7-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

uploadToFirebase = async (userId, events) => {
    const obj = JSON.parse(events);
    const eventName = obj.eventName;
    console.log('Event name: ', eventName);
    console.log('events:', obj.events);
    sendPlanToFirebase(userId, obj.events, eventName, db);
};


async function sendPlanToFirebase(userId, events, eventName, db) {
    const eventsRef = db.collection('users').doc(userId).collection('plans');

    try {
        await eventsRef.doc(eventName).set({ events: events });
        console.log('Plan successfully uploaded to Firestore!');
    } catch (err) {
        console.error('There is an error:', err);
    }
};


async function getEventsFromFirebase(startDate) {
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

async function getUserEmail(userId) {
    const userRef = db.collection('users/').doc(userId);
    const user = await userRef.get();

    if (!user.exists) {
        throw new Error('User not found');
    }
    return user.data().email;
}

module.exports = { uploadToFirebase, getEventsFromFirebase, db, admin, getUserEmail }; 