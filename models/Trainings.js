const mongoose = require("mongoose");

let Trainings = new mongoose.Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: true
  },
  completion_date: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  remark: {
    type: String,
  }

});

module.exports = mongoose.model("Trainings", Trainings);
