const mongoose = require("mongoose");
const config = require("config");
const logger = require("../bootstrap/logging");

module.exports = function () {
  mongoose
    .connect(
      config.get("db"),
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    )
    .then(() => logger.log("info", "Connected to db"))
    .catch((error) => logger.log("error", error));
};
