const { db } = require('../../configs/firebase');
const { sendPlanToFirebase } = require('./managePlans');

uploadToFirebase = async (userId, snapshot) => {
    const obj = JSON.parse(snapshot);
    const eventName = obj.eventName;
    console.log('Event name: ', eventName);
    obj.events.forEach((event, index) => console.log(index, ' ', event.title));
    sendPlanToFirebase(userId, obj.events, eventName, db);
};

module.exports = { uploadToFirebase };