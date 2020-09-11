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
/* const { authenticate } = require("./authTools")
const UserModel = require("./schema")
require('dotenv').config();

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/auth/facebook/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            facebookId: profile.id,
            email: profile.emails[0].value,
            refreshTokens: [],
        }

        try {
            const user = await UserModel.findOne({ facebookId: profile.id })

            if (user) {
                const tokens = await authenticate(user)
                done(null, { user, tokens })
            } else {
                createdUser = await UserModel.create(newUser)
                const tokens = await authenticate(createdUser)
                done(null, { user, tokens })
            }
        } catch (error) {
            console.log(error)
            done(error)
        }
    }
)
)

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})
 */
