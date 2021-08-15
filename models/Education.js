const mongoose = require("mongoose");

let Education = new mongoose.Schema({
  institute: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum:["Masters","Bachelor","+2", "S.E.E", ],
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  start_year: {
    type: String,
    required: true,
  },
  end_year: {
    type: String,
    required: true,
    default: -1,
  },
  cgpa: {
    type: String,
    required: true,
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Education", Education);
