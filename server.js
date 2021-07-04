const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path")
const app = express();

const dbURI = require("./config/config").mongoURI;
const users = require("./routes/user");
const listings = require("./routes/listings");
const ratings = require("./routes/rating");
const applications = require("./routes/applications");
const cv = require("./routes/cv");
const dp = require("./routes/dp");
const PORT = 5000  || process.env.PORT;
const cors = require("cors");
app.use(cors());

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'build')))
app.use("/api/user", users);
app.use("/api/list", listings);
app.use("/api/rating", ratings);
app.use("/api/appl", applications);
app.use("/api/cv", cv);
app.use("/api/dp", dp);
app.listen(PORT, () => console.log(`listening to ${PORT}`));
