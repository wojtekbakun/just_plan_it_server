const { db } = require('../../configs/firebase');

// Function to get reference to the collection in Firestore
// userId - string, id of the user (optional)
function getRef({ userId } = {}) {
    if (userId !== undefined) {
        return db.collection('users').doc(userId).collection('plans');
    }
    return db.collection('users');
}

module.exports = { getRef }