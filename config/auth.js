const jwt = require("jsonwebtoken");
const keys = require("../config/config");
module.exports = function validateLoginInput(token) {
  const decoded = jwt.verify(token, keys.secret, (err, decoded) => {
    if (err) {
      return null;
    } else {
      var userId = decoded.id;
      return userId;
    }
  });
  return decoded;
};
