let router = require("express").Router();
const auth = require("../config/auth");
let User = require("../models/User");
let Listings = require("../models/Listings");
let Applications = require("../models/Application");

// @route GET api/rating/user
// @desc Rate user and update Application
// @access Private
router.post("/user", (req, res) => {
  console.log(req.body);
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) {
    return res.status(401).send("Not Authorised");
  }
  User.updateOne(
    { _id: req.body.ida },
    {
      $inc: { sum: req.body.value, count: 1 },
    },
    function (err, user) {
      if (err) {
        console.log(err);
        res.status(400).send("Error in rating!");
      } else {
        Applications.updateOne(
          { _id: req.body.idl },
          {
            $set: req.body.set,
          },
          function (err, listings) {
            if (err) {
              console.log(err);
              res.status(400).send("Error in Rating");
            } else {
              res.status(200).send("Success!");
            }
          }
        );
      }
    }
  );
});
// @route GET api/rating/job
// @desc Rate Job and update Application
// @access Private

router.post("/job", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) {
    return res.status(401).send("Not Authorised");
  }
  Listings.updateOne(
    { _id: req.body.idl },
    {
      $inc: { sum: req.body.value, count: 1 },
    },
    function (err, user) {
      if (err) {
        console.log(err);
        res.status(400).send("Error in rating!");
      } else {
        Applications.updateOne(
          { _id: req.body.ida },
          {
            $set: req.body.set,
          },
          function (err, listings) {
            if (err) {
              console.log(err);
              res.status(400).send("Error in Rating");
            } else {
              res.status(200).send("Success!");
            }
          }
        );
      }
    }
  );
});

module.exports = router;
