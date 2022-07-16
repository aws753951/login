const router = require("express").Router();
const Poster = require("../models/post-model");

const checkAuthentication = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", checkAuthentication, async (req, res) => {
  let posts = await Poster.find({ ID: req.user._id });
  res.render("profile", { user: req.user, posts });
});

router.get("/post", checkAuthentication, (req, res) => {
  res.render("post", { user: req.user });
});

router.post("/post", checkAuthentication, (req, res) => {
  let { title, content } = req.body;
  let newPost = new Poster({
    title,
    content,
    username: req.user.name,
    ID: req.user._id,
  });
  newPost
    .save()
    .then(() => {
      res.status(200).redirect("/profile");
    })
    .catch((e) => {
      req.flash("error_msg", "Both title and contenct required.");
      res.redirect("/profile/post");
    });
});

module.exports = router;
