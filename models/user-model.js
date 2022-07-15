const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  //   google的圖片
  thumbnail: {
    type: String,
  },
  // local login
  email: {
    type: String,
  },
  password: {
    type: String,
    minlength: 8,
    maxLength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
