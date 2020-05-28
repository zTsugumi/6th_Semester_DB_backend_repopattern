var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;             // Use local strat for first-time login
var JwtStrategy = require('passport-jwt').Strategy;                 // Use Jwt strat after that
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('../config');

var User = require('../models/user');


/*********************************************** local strat to check user ***********************************************/
// user and password is passed through body of request
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.localVerifyUser = passport.authenticate('local');

/************************************************ JWT strat to check user ************************************************/
// Create token from user object
exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
// Define how jsonwebtoken should be extracted from the incoming request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// Supply secret key that going to used in our strategy
opts.secretOrKey = config.secretKey;

passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        // done: pass back info to passport, which will be used for loading things onto the request message
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.jwtVerifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
    User.findOne({ _id: req.user._id })
        .then(
            (user) => {
                if (user.admin === true) {
                    return next();
                }
                else {
                    err = new Error('You are not authorized to perform this action');
                    err.status = 401;
                    return next(err);
                }
            },
            (err) => next(err)
        )
        .catch((err) => next(err));
};
