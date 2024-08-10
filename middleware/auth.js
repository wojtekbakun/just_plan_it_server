const passport = require('../configs/passport-config');

const ensureAuthenticated = (req, res, next) => {
    // if user is authenticated by themselve
    if (req.isAuthenticated()) {
        // go to the next middleware
        return next();
    }

    // if user is authenticated by token
    passport.authenticate('bearer', { session: false }, (err, user, info) => {
        // if there is an error
        if (err) {
            // go to the next middleware with the error
            return next(err);
        }
        // if there is no user
        if (!user) {
            // return 401 Unauthorized
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // pass the user to the request object       
        req.user = user;
        next();

        // call authenticate with the current request and response
    })(req, res, next);
};

module.exports = { ensureAuthenticated };