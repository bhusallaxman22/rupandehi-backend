const path = require("path");
const express = require("express");
const multer = require("multer");
const File = require("../models/dp");
const User = require("../models/User");
const Router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./files");
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error("only upload jpeg jpg png file"));
    }
    cb(undefined, true);
  },
});

Router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const { uid } = req.body;
      const { path, mimetype } = req.file;
      const file = new File({
        uid,
        file_path: path,
        file_mimetype: mimetype,
      });

      await file.save();
      let user = await User.findOne({ _id: uid });
      if (user.cv === true) {
        res.status(400).send("This user already has a DP!");
      }
      user.dp = true;
      await user.save();
      res.send("CV uploaded successfully.");
    } catch (error) {
      console.log(error);
      res.status(400).send("Error while uploading DP. Try again later.");
    }
  },
  (error, req, res, next) => {
    if (error) {
      res.status(500).send(error.message);
    }
  }
);

Router.get("/download/:id", async (req, res) => {
  try {
    const file = await File.findOne({ uid: req.params.id });
    if (!file) {
      res.status(400).send("This user has no DP");
      return;
    }
    res.set({
      "Content-Type": file.file_mimetype,
    });
    res.sendFile(path.join(__dirname, "..", file.file_path));
  } catch (error) {
    res.status(400).send("Error while downloading file. Try again later.");
  }
});
Router.get("/get/:id", async (req, res) => {
  try {
    const file = await File.findOne({ uid: req.params.id });
    if (!file) {
      res.status(400).send("This user has no CV!");
    }
    res.json(file);
  } catch (error) {
    res.status(400).send("Error while getting list of files. Try again later.");
  }
});

module.exports = Router;
