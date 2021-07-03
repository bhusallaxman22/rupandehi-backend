const mongoose = require("mongoose");

let Application = new mongoose.Schema({
  rid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  SOP: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  name_r: {
    type: String,
    required: true,
  },
  DateofJoining: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  Status: {
    type: String,
    enum: ["Accepted", "Rejected", "Pending", "Shortlisted", "Deleted"],
    default: "Pending",
  },
  urated: {
    type: Number,
    default: -1,
  },
  rrated: {
    type: Number,
    default: -1,
  },
  salary: {
    type: Number,
    required: true,
  },
  applied_on: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

module.exports = mongoose.model("Application", Application);
