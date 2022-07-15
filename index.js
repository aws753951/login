require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./config/passport");
const authRouter = require("./routes/auth-route");
const profileRouter = require("./routes/profile-route");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

mongoose
  .connect(process.env.ALTAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected altas");
  })
  .catch((err) => {
    console.log("Fail connected altas");
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.listen(8080, () => {
  console.log("Port 8080 is running.");
});
