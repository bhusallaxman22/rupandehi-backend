let router = require("express").Router();
let Applications = require("../models/Application");
let Educations = require("../models/Education");
let Skills = require("../models/Skills");
let Listings = require("../models/Listings");
let User = require("../models/User");
const auth = require("../config/auth");
const fixJobs = require("../helpers/fixJobs");
const { findOne } = require("../models/Application");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

// @route POST api/appl/add
// @desc adds an Application, if already accepted or have 10 applications, can't apply anymore
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
  return Applications.find({ uid: req.body.uid }).then((app) => {
    if (app) {
      var count = 0;
      for (var i = 0; i < app.length; i++) {
        if (app[i].Status !== "Rejected" && app[i].Status !== "Deleted") {
          count++;
        }
        if (app[i].Status == "Accepted") {
          return res
            .status(400)
            .send("You already have an Accepted Application!");
        }
        if (app[i].lid === req.body.lid) {
          return res.status(400).send("You already Applied!");
        }
      }
      if (count >= 10) {
        return res.status(400).send("You already have 10 applications!");
      } else {
        return Listings.findOne({ _id: req.body.lid }).then((l) => {
          if (l.max_no_of_applicants > l.curr_app) {
            let Application = new Applications(req.body);
            return Application.save((err, list) => {
              if (err) {
                return res.status(400).send("Error Adding Application");
              } else {
                Listings.updateOne(
                  { _id: req.body.lid },
                  {
                    $inc: { curr_app: 1 },
                  },
                  function (err, listing) {
                    if (err) {
                    } else {
                    }
                  }
                );
                Listings.findOne({ _id: req.body.lid }).then((l) => {
                  if (l.accepted === l.available_no) {
                    Applications.find({ lid: l._id }).then((appls) => {
                      if (appls) {
                        for (var i = 0; i < appls.length; i++) {
                          appls[i].Status = "Rejected";
                          appls[i].save();
                        }
                      }
                    });
                  }
                });

                return res.status(200).json(list);
              }
            });
          } else {
            return res
              .status(400)
              .send("You can't apply since it has reached max allowed!");
          }
        });
      }
    }
  });
});
// @route POST api/appl/
// @desc Gets all Applications based on request format
// @access Private

router.post("/", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not authorised!");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not authorised!");
  fixJobs();
  Applications.find(req.body.cond).then((listings) => {
    if (listings) {
      return res.status(200).json(listings);
    } else {
      return res.status(400).send("No Applications");
    }
  });
});
// @route POST api/appl/update
// @desc Updates Application based on request, Rejects all by an Applicant once Accepted
// @access Private

router.post("/update/", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  return Applications.updateMany(
    { _id: req.body.id, Status: req.body.oldStatus },
    {
      $set: req.body.set,
    },
    function (err, app) {
      if (err) {
        return res.status(400).send("Error in Server");
      } else {
        if (req.body.set.Status === "Accepted" && app.nModified >= 1) {
          User.findOne({ _id: req.body.uid }).then((user) => {
            if (user) {
              var transporter = nodemailer.createTransport(
                smtpTransport({
                  service: "gmail",
                  host: "smtp.gmail.com",
                  auth: {
                    user: "dassjobportal@gmail.com",
                    pass: "job-portal",
                  },
                })
              );

              var mailOptions = {
                from: "dassjobportal@gmail.com",
                to: user.Email,
                subject: "Your Application has been accepted",
                text:
                  "Congrats " +
                  user.Name +
                  " !" +
                  req.body.name +
                  " accepted your application on the DASS Job Portal.",
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            }
          });
          Listings.updateMany(
            { _id: req.body.lid },
            {
              $inc: { accepted: 1, curr_app: -1 },
            },
            function (err, listing) {
              if (err) {
              } else {
              }
            }
          );
          Applications.find({ uid: req.body.uid }).then((appl) => {
            if (appl) {
              for (var i = 0; i < appl.length; i++) {
                if (
                  appl[i].Status !== "Rejected" &&
                  appl[i].Status !== "Deleted" &&
                  appl[i].Status !== "Accepted"
                ) {
                  appl[i].Status = "Rejected";
                  appl[i].save();
                  Listings.updateMany(
                    { _id: appl[i].lid },
                    {
                      $inc: { curr_app: -1 },
                    },
                    function (err, listing) {
                      if (err) {
                      } else {
                      }
                    }
                  );
                }
              }
            }
          });
        }
        if (req.body.set.Status === "Rejected" && app.nModified >= 1) {
          Listings.updateMany(
            { _id: req.body.lid },
            {
              $inc: { curr_app: -1 },
            },
            function (err, listing) {
              if (err) {
              } else {
              }
            }
          );
        }
        return res.status(200).send("Success!");
      }
    }
  );
});

// @route POST api/appl/delete
// @desc Deletes an Application based on request
// @access Private
router.post("/delete/", (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not Authorised");
  }
  var id = auth(token);
  if (!id) return res.status(401).send("Not Authorised");
  Listings.deleteOne({ _id: req.body.id })
    .then(() => {
      return res.status(200).send("Success!");
    })
    .catch((err) => {
      return res.status(400).send("Error in delete");
    });
});

// @route POST api/appl/view
// @desc Gets all Applications based on request format along with user data
// @access Private
router.post("/view", async (req, res) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Not authorised!");
  }
  var returnList = [];
  var id = auth(token);
  if (!id) return res.status(401).send("Not authorised!");
  fixJobs();
  returnValue = [];
  let appl = await Applications.find(req.body.cond);
  for (var i = 0; i < appl.length; i++) {
    var item = {
      appl: appl[i],
      user: "",
      skills: [],
      Edu: [],
      job: {},
    };
    let edu = await Educations.find({ uid: appl[i].uid });
    if (edu) {
      item.Edu = edu;
    }
    let skills = await Skills.find({ uid: appl[i].uid });
    if (skills) {
      item.skills = skills;
    }
    let user = await User.findOne({ _id: appl[i].uid });
    item.user = user;

    let job = await Listings.findOne({ _id: appl[i].lid });
    item.job = job;

    returnValue.push(item);
  }
  return res.status(200).json(returnValue);
});

module.exports = router;
