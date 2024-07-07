// routes.js
const express = require("express");
const router = express.Router();

const oauth2Client = require("../configs/oauth2");
const calendar = require("../services/googleCalendar");

router.post("/send-event", async (req, res) => {
    const event = req.body.events;
    const insertPromises = event.map((evencior) => {
        const singleEvent = {
            summary: `title:${evencior.title}`,
            description: evencior.description,
            start: {
                dateTime: "2024-07-07T09:00:00-07:00",
                timeZone: "America/Los_Angeles",
            },
            end: {
                dateTime: "2024-07-07T17:00:00-07:00",
                timeZone: "America/Los_Angeles",
            },
        };

        return new Promise((resolve, reject) => {
            calendar.events.insert(
                {
                    auth: oauth2Client,
                    calendarId: "primary",
                    resource: singleEvent,
                },
                function (err, event) {
                    if (err) {
                        console.log(
                            "There was an error contacting the Calendar service: " + err
                        );
                        reject(err);
                    } else {
                        console.log("Event created");
                        resolve(event);
                    }
                }
            );
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

module.exports = router;