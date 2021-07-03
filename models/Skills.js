const mongoose = require("mongoose");

let Skill = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Skill", Skill);
