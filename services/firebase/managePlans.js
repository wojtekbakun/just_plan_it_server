const { response } = require('express');
const { getRef } = require('./reference');


async function sendPlanToFirebase(userId, events, eventName) {
    console.log('userId:', userId);
    const eventsRef = getRef({ userId: userId });
    currentDateISO = new Date().toISOString();
    try {
        await eventsRef.doc().set({
            eventName: eventName, events: events, createdAt: currentDateISO
        });
        console.log('Plan successfully uploaded to Firestore!');
    } catch (err) {
        console.error('There is an error:', err);
    }
};


async function getEventsFromFirebase(userId, planId) {
    const eventsRef = getRef({ userId: userId, planId: planId })


    return eventsRef.get().then((doc) => {
        if (doc.exists) {
            // Document data will be available here
            const events = doc.data().events;
            return { events: events, status: 200 };
        } else {
            // The document does not exist
            return { events: null, status: 404 };
        }
    })
        .catch((error) => {
            console.error('Error getting document:', error);
        });
}

async function getAllEventsForUser(userId) {
    const eventsRef = getRef({ userId: userId });
    return eventsRef.get().then((querySnapshot) => {
        const events = [];
        querySnapshot.forEach((doc) => {
            events.push(doc.data());
        });
        return { events: events, status: 200 };
    })
        .catch((error) => {
            console.error('Error getting documents:', error);
        });

}

module.exports = { sendPlanToFirebase, getEventsFromFirebase, getAllEventsForUser };