const mongoose = require("mongoose");

let Socials = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Special", Socials);