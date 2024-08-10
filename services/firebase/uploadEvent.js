const { db } = require('../../configs/firebase');
const { sendPlanToFirebase } = require('./managePlans');

uploadToFirebase = async (userId, events) => {
    const obj = JSON.parse(events);
    const eventName = obj.eventName;
    console.log('Event name: ', eventName);
    obj.events.forEach((event, index) => console.log(index, ' ', event.title));
    sendPlanToFirebase(userId, obj.events, eventName, db);
};

module.exports = { uploadToFirebase };