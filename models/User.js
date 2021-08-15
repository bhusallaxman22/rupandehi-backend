const mongoose = require("mongoose");

let User = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Bio: {
    type: String,
    default: "You can edit to add Bio!",
  },
  type: {
    type: String,
    enum: ["A", "R"],
    default: "A",
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  sum: {
    type: Number,
    default: 0,
  },
  count: {
    type: Number,
    default: 0,
  },
  Contact: {
    type: Number,
    default: 0,
  },
  dob:{
    type:Date,
    default:null
  },
  Address:{
    type:String,
    default:""
  },
  cv: {
    type: Boolean,
    default: false,
  },
  dp: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ["Male", "Female","Others"],
  },
  nationality:{
    type:String,
    default:"Nepali"
  },
  marital_status :{
    type:String,
    enum:["Married","Single","Divorced","Widowed"],
    default:"Single"
  },
  religion:{
   type:String,
  }

});

module.exports = mongoose.model("User", User);
