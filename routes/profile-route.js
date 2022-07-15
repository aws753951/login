const router = require("express").Router();

const checkAuthentication = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", checkAuthentication, (req, res) => {
  res.render("profile", { user: req.user });
});

module.exports = router;
