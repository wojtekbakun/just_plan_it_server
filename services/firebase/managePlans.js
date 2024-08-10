const { db } = require('../../configs/firebase');
const { getRef } = require('./reference');


async function sendPlanToFirebase(userId, events, eventName) {
    const eventsRef = getRef(userId);

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

module.exports = { sendPlanToFirebase };