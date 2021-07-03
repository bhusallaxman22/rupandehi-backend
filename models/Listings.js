const mongoose = require("mongoose");

let Listing = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  name_of_r: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  curr_app: {
    type: Number,
    default: 0,
  },
  accepted: {
    type: Number,
    default: 0,
  },
  max_no_of_applicants: {
    type: Number,
    required: true,
    validate: [
      function validator(val) {
        if (this.curr_app) {
          return val >= this.curr_app;
        } else {
          return val >= 0;
        }
      },
      "Invalid Max no. of Applicants",
    ],
  },
  available_no: {
    type: Number,
    required: true,
    min: 1,
    validate: [
      function validator(val) {
        if (this.accepted) {
          return val >= this.accepted;
        } else {
          return val >= 0;
        }
      },
      "Invalid Max no. of Open Positions",
    ],
  },
  deadline: {
    type: Date,
    required: true,
  },
  postedOn: {
    type: Date,
    required: true,
  },
  requiredSkills: {
    type: [String],
    required: true,
  },
  typeofJob: {
    type: String,
    enum: ["Full-Time", "Part-Time", "WFH"],
    default: "Full-Time",
  },
  duration: {
    type: Number,
    default: 0,
  },
  salary: {
    type: Number,
    required: true,
  },
  rid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Status: {
    type: String,
    enum: ["Deadline Expired", "Open"],
    default: "Open",
  },
  sum: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Listing", Listing);
