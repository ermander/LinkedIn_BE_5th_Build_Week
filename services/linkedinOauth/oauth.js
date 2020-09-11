const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const UserSchema = require("../registration/schema");
const { authenticate } = require("../registration/authTools");

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
      const newUser = {
        linkedinId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        role: "user",
        refreshTokens: [],
      };
      try {
        const user = await UserModel.findOne({ linkedinId: profile.id });

        if (user) {
          const tokens = await authenticate(user);
          done(null, { user, tokens });
        } else {
          createdUser = await UserModel.create(newUser);
          const tokens = await authenticate(createdUser);
          done(null, { user, tokens });
        }
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

app.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
