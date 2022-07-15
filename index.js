require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(8080, () => {
  console.log("Port 8080 is running.");
});
