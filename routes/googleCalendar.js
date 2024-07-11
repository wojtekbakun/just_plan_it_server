// routes.js
const express = require("express");
const router = express.Router();

const oauth2Client = require("../configs/oauth2");
const calendar = require("../services/googleCalendar");


router.post("/sendToGoogleCalendar", async (req, res) => {
    const event = req.body.events;
    const insertPromises = event.map((singleEvent) => {
        const eventForGoogleCalendar = {
            summary: singleEvent.title,
            description: `${singleEvent.description}\n\n Link to resource: ${singleEvent.resourceLink}`,
            start: {
                dateTime: singleEvent.startDate,
                timeZone: singleEvent.timeZone,
            },
            end: {
                dateTime: singleEvent.endDate,
                timeZone: singleEvent.timeZone,
            },
        };

        return new Promise((resolve, reject) => {
            insertEvent(calendar, oauth2Client, eventForGoogleCalendar, resolve, reject);
        });
    });

    Promise.all(insertPromises)
        .then(() => {
            res.send("All events created");
        })
        .catch((err) => {
            res.status(500).send("An error occurred");
        });
});


function insertEvent(calendar, oauth2Client, eventToSend, resolve, reject) {
    calendar.events.insert(
        {
            auth: oauth2Client,
            calendarId: "primary",
            resource: eventToSend,
        },
        function (err, event) {
            if (err) {
                console.log(
                    "There was an error contacting the Calendar service: " + err
                );
                reject(err);
            } else {
                console.log(`Event created: ${event.data.htmlLink}`);
                resolve(event);
            }
        }
    );
}

module.exports = router;