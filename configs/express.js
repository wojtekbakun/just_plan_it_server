const express = require('express');
const sessionMiddleware = require('../middleware/session');

module.exports = function (app) {
    app.use(express.json());
    // Middleware do parsowania danych formularza
    app.use(express.urlencoded({ extended: true }));
    app.use(sessionMiddleware);
}