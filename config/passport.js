const GoogleStrategy = require("passport-google-oauth20");
const passport = require("passport");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");

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

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result == true) {
          return done(null, user);
        }
        return done(null, false);
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
  User.findById({ _id }).then((user) => {
    done(null, user);
  });
});
