const passport = require("passport");
const User = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, next) => {
      let user = await User.findOne({ email: profile._json.email });
      if (user) {
        next(null, user);
      } else {
        user = await User.create({
          name: profile.displayName,
          email: profile._json.email,
          googleId: profile.id,
          avatar: profile._json.picture,
        });
        next(null, user);
      }
    }
  )
);
