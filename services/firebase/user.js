const { getRef } = require('./reference');

async function addUser(name, email, userId) {
    const userRef = getRef({ userId: userId });
    const timestamp = Date.now();
    const isoDate = new Date(timestamp).toISOString();

    await userRef.set({
        name: name,
        email: email,
        googleId: userId,
        accountCreatedAt: isoDate
    })
        .then(() => {
            console.log('User added');
        })
        .catch((err) => {
            console.error('An error occurred: ', err);
        });
}

module.exports = { addUser };
