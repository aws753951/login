const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

router.get("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;
  User.findOne({ email }).then((foundUser) => {
    if (foundUser) {
      res.redirect("/auth/login");
    } else {
      bcrypt.hash(password, 12, (err, hash) => {
        let newUser = new User({ name, email, password: hash });
        newUser
          .save()
          .then(() => {
            res.redirect("/auth/login");
          })
          .catch((e) => {
            console.log(e);
            res.redirect("/auth/signup");
          });
      });
    }
  });
});

module.exports = router;
