const mongoose = require("mongoose");

let Education = new mongoose.Schema({
  institute: {
    type: String,
    required: true,
  },
  start_year: {
    type: Number,
    required: true,
  },
  end_year: {
    type: Number,
    required: true,
    default: -1,
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Education", Education);
