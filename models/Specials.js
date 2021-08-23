const mongoose = require("mongoose");

let Special = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Special", Special);