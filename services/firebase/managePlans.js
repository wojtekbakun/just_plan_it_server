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


async function getEventsFromFirebase(userId, planId) {
    const eventsRef = getRef({ userId: userId, planId: planId })
    await eventsRef.get().then((doc) => {
        if (doc.exists) {
            // Document data will be available here
            const events = doc.data().events;
            return events;
        } else {
            // The document does not exist
            console.log('No such document!');
        }
    })
        .catch((error) => {
            console.error('Error getting document:', error);
        });
}

module.exports = { sendPlanToFirebase, getEventsFromFirebase };