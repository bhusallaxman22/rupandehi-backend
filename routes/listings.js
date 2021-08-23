let router = require("express").Router();
let Listings = require("../models/Listings");
let Application = require("../models/Application");
let User = require("../models/User");
const auth = require("../config/auth");
const fixJobs = require("../helpers/fixJobs");

// @route POST api/list/add
// @desc adds to list
// @access Private
router.post("/add", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) {
    return res.status(401).send("Not Authorised");
  }
  let listing = new Listings(req.body);
  return listing.save((err, list) => {
    if (err) {
      return res.status(400).send(err);
    } else return res.status(200).json(list);
  });
});
// @route POST api/list/
// @desc Gets all list, calls fix, which goes through the list once puts Status to Deadline-Expired if Deadline is over and Rejects all open Applications after deadline
// @access Private

router.post("/", (req, res) => {
  // const token = req.header("x-auth-token");
  // if (!token) {
  //   return res.status(401).send("Not authorised!");
  // }
  // var id = auth(token);
  // if (!id) return res.status(401).send("Not authorised!");
  fixJobs();
  Listings.find(req.body.cond).then((listings) => {
    if (listings) {
      return res.status(200).json(listings);
    } else {
      return res.status(404).send("No Listings");
    }
  });
});


router.get("/:id", (req, res) => {
  var id = req.params.id;
  Listings.findOne({ _id: id }).then((list) => {
    if (list) {
      return res.status(200).json(list);
    } else {
      return res.status(401).send("Not found");
    }
  });
});

// @route POST api/list/delete
// @desc Deletes from Job List, puts every Application to Deleted
// @access Private

router.post("/delete/", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  Listings.deleteOne({ _id: req.body.id }).then((edu) => { });
  Application.find({ lid: req.body.id }).then((apps) => {
    for (var i = 0; i < apps.length; i++) {
      apps[i].Status = "Deleted";
      apps[i].save();
    }
  });
});

// @route GET api/list/update
// @desc Updates Job List,
// @access Private

router.post("/update/", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  const opts = { runValidators: true };
  Listings.updateOne(
    { _id: req.body.id },
    {
      $set: req.body.set,
    },
    opts,
    function (err, listings) {
      if (err) {
        if (err.errors.max_no_of_applicants) {
          res.status(400).send(err.errors.max_no_of_applicants.message);
        } else if (err.errors.available_no) {
          res.status(400).send(err.errors.available_no.message);
        }
      } else {
        res.status(200).send("Success!");
      }
    }
  );
});
// @route GET api/list/rid
// @desc Gets List by rid
// @access Private

router.get("/rid", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not authorised!");
  }
  var id = auth(token);
  fixJobs();
  Listings.find({ rid: id }).then((listings) => {
    if (listings) {
      return res.status(200).json(listings);
    } else {
      return res.status(400).send("No Listings!");
    }
  });
});

module.exports = router;
