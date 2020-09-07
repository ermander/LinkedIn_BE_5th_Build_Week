const passport = require("passport")

require('dotenv').config();

//const GoogleStrategy = require("passport-google-oauth20").Strategy
const FacebookStrategy = require('passport-facebook').Strategy;

//const UserModel = require("./schema")
//const { authenticate } = require("./authTools")

passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: 'http://localhost:3001/auth/facebook/callback'
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
