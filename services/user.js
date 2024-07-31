const admin = require('firebase-admin');

const userId = 'user123';
async function addUser(name, email, password) {

    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);

    await userRef.set({
        name: name,
        email: email,
        password: password,
    })
        .then(() => {
            console.log('User added');
        })
        .catch((err) => {
            console.error('An error occurred: ', err);
        });
}

module.exports = { addUser };
