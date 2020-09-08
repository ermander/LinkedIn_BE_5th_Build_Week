const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('./models/user');
require('dotenv').config();

passport.use('facebook', new FacebookTokenStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:3001/auth/facebook/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        if (await User.findOne({ 'facebook_id': profile.id })) return console.log('Account existent')
        const email = profile.emails[0].value;
        const { id: facebook_id, displayName: name } = profile;
        const user = await User.create({
            email, facebook_id, name
        })
        await user.save();
        done(null, user)

        console.log(user)
    } catch (error) {
        done(error, false, error.message)
    }
}));
