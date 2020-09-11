const passport = require("passport")
const FacebookStrategy = require('passport-facebook').Strategy;
const UserModel = require("./schema")
const { authenticate, generateJWT } = require("./authTools")


passport.use('facebook', new FacebookStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3001/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    //
    try {
        /*  if (await UserModel.findOne({ 'facebook_id': profile.id })) return console.log('Account existent')
         const generate = await generateJWT(user)
         const email = profile.email;
         const { id: facebook_id, displayName: name } = profile;
         const User = await User.create({
             email, facebook_id, name
         })
         await user.save();
         done(null, { user, tokens })  */

        //console.log(user)
        const token = await generateJWT({})
        console.log(token)
        console.log("profile", profile)
    } catch (error) {
        done(error, false, error.message)
    }
}));
 /*
passport.serializeUser(function (user, done) {
done(null, user)
})

passport.deserializeUser(function (user, done) {
done(null, user)
}) */
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
    done(null, user)*/
//})
