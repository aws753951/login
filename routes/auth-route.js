const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Wrong email or password.",
    keepSessionInfo: true,
  }),
  function (req, res) {
    if (req.session.returnTo) {
      let newPath = req.session.returnTo;
      req.session.returnTo = "";
      res.redirect(newPath);
      console.log("-------------");
      console.log(newPath);
    } else {
      res.redirect("/profile");
    }
  }
);

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
      req.flash("error_msg", "Email has been signup.");
      res.redirect("/auth/login");
    } else {
      bcrypt.hash(password, 12, (err, hash) => {
        let newUser = new User({ name, email, password: hash });
        newUser
          .save()
          .then(() => {
            req.flash("success_msg", "Registration succeeds.");
            res.redirect("/auth/login");
          })
          .catch((e) => {
            req.flash("error_msg", e.errors.name.properties.message);
            res.redirect("/auth/signup");
          });
      });
    }
  });
});

module.exports = router;
