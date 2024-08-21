const { db } = require('../../configs/firebase');

// Function to get reference to the collection in Firestore
// userId - string, id of the user (optional)
function getRef({ userId, planId } = {}) {
    if (userId !== undefined) {
        if (planId !== undefined) {
            return db.collection('users').doc(userId).collection('plans').doc(planId);
        }
        console.log('plan id is undefined, returning collection');
        return db.collection('users').doc(userId).collection('plans');
    }
    return db.collection('users');
}

module.exports = { getRef }