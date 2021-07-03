let Listings = require("../models/Listings");
function fixJobs() {
  Listings.find().then((listings) => {
    if (listings) {
      for (var i = 0; i < listings.length; i++) {
        var currdate = new Date();
        var deadline = new Date(listings[i].deadline);
        if (deadline - currdate < 0) {
          listings[i].Status = "Deadline Expired";
          listings[i].save();
        } else if (
          deadline - currdate > 0 &&
          listings[i].Status == "Deadline Expired"
        ) {
          listings[i].Status = "Open";
          listings[i].save();
        }
      }
    }
  });
}

module.exports = fixJobs;
