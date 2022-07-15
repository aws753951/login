const GoogleStrategy = require("passport-google-oauth20");
const passport = require("passport");
const User = require("../models/user-model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          return cb(null, foundUser);
        } else {
          new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          })
            .save()
            .then((newUser) => {
              return cb(null, newUser);
            });
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
  User.findById({ _id }).then((user) => {
    done(null, user);
  });
});
