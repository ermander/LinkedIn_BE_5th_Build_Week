const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const UserModel = require("../registration/schema");
const { authenticate, generateJWT } = require("../registration/authTools");
const { aggregate } = require("../registration/schema");
const loginRouter = require("../registration");
const passport = require("passport");

passport.use(
  "linkedin",
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_ID,
      clientSecret: LINKEDIN_SECRET_KEY,
      callbackURL: "http://localhost:3002/auth/linkedin/callback",
      scope: ["r_emailaddress", "r_basicprofile"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const token = await generateJWT({});
        console.log(token);
        console.log("profile", profile);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
