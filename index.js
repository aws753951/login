require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routes/auth-route");
require("./config/passport");

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
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8080, () => {
  console.log("Port 8080 is running.");
});
