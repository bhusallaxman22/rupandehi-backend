const mongoose = require("mongoose");

let Listing = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  edu_level: {
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
  level: {
    type: String,
    required: true
  },
  job_location: {
    type: String,
  },
  applicant_no: {
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
    type: String,
    required: true,
  },
  postedOn: {
    type: Date,
    required: true,
    default: Date.now()
  },
  skills: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["Full Time", "Part Time", "WFH", "Contract"],
    default: "Full Time",
  },
  requirements: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true,
  },
  apply_note: {
    type: String,
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
  view_count: {
    type: Number,
    default: 0
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
