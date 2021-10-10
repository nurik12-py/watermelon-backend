const config = require("config");

module.exports = function () {
  if (!config.get("jwt_key")) {
    console.log("jwt_key is not provided");
    process.exit(1);
  }
};
