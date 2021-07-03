const mongoose = require("mongoose");

let dp = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    file_path: {
      type: String,
      required: true,
    },
    file_mimetype: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DP", dp);
