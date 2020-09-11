const passport = require("passport")
const FacebookStrategy = require('passport-facebook').Strategy;


passport.use('facebook', new FacebookStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3001/user/auth/facebook/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        /*  if (await User.findOne({ 'facebook_id': profile.id })) return console.log('Account existent')
         const email = profile.emails[0].value;
         const { id: facebook_id, displayName: name } = profile;
         const user = await User.create({
             email, facebook_id, name
         })
         await user.save();
         done(null, user)
 
         console.log(user) */
        console.log("profile", profile)
    } catch (error) {
        done(error, false, error.message)
    }
}));